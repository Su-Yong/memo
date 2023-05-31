import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Tree, TreeChildren, TreeParent } from 'typeorm';
import { z } from 'zod';
import { registerModel } from '@/models/model';
import { ModifiableDAO } from '@/models/Common';
import { MemoResponse, WorkspaceSchema, fromLazy } from '@suyong/memo-core';
import type { Memo, User, UserSchema, Workspace, MemoTreeResponse } from '@suyong/memo-core';
import { ToWorkspaceResponseOptions, WorkspaceDAO } from '@/domains/workspaces/models/Workspace.model';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { generateHTML } from '@tiptap/html';
import * as Y from 'yjs';

export interface ToMemoResponseOptions {
  withWorkspace?: boolean | ToWorkspaceResponseOptions<any>;
  withAvailableActions?: User;
}
@registerModel
@Entity({ name: 'memo' })
@Tree('closure-table', { closureTableName: 'memo_closure' })
export class MemoDAO extends ModifiableDAO implements Memo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  image?: string;

  @Column({
    type: 'longtext',
    nullable: true,
    transformer: {
      to(value: Buffer): string | undefined {
        return Buffer.from(value).toString('base64');
      },
      from(value: string | undefined): Buffer | undefined {
        if (!value) return undefined;

        return Buffer.from(value, 'base64');
      },
    }
  })
  content?: Buffer;

  @Column({
    type: 'enum',
    enum: ['public', 'link', 'member'],
    default: 'member'
  })
  visibleRange!: 'public' | 'link' | 'member';

  @Column({
    type: 'enum',
    enum: ['public', 'link', 'member', 'owner'],
    default: 'member'
  })
  editableRange!: 'public' | 'link' | 'member' | 'owner';

  @ManyToOne('WorkspaceDAO', (workspace: Workspace) => workspace.memos)
  @JoinColumn()
  workspace!: Promise<Workspace> | Workspace;

  @TreeChildren()
  children!: Memo[];

  @TreeParent()
  parent!: Memo;

  async canRead(user: z.infer<typeof UserSchema.response>): Promise<boolean> {
    const [
      isMember,
      isOwner
    ] = await Promise.all([
      !!(await (await this.workspace)?.members)?.find((member) => member.id === user.id),
      (await (await this.workspace)?.owner)?.id === user.id,
    ]);

    return isMember || isOwner;
  }

  canUpdate = this.canRead;

  // async canUpdate(user: z.infer<typeof UserSchema.response>): Promise<boolean> {
  //   const isOwner = (await this.owner)?.id === user.id;

  //   return isOwner || user.permission === 'admin';
  // }

  // canDelete = this.canUpdate;

  // async canVisible(user: z.infer<typeof UserSchema.response>): Promise<boolean> {
  //   if (this.visibleRange === 'public') return true;
  //   if (this.visibleRange === 'link') return true;

  //   const isMember = !!(await this.members)?.find((member) => member.id === user.id);
  //   const isOwner = (await this.owner)?.id === user.id;

  //   return  isMember || isOwner;
  // }

  // async canEditable(user: z.infer<typeof UserSchema.response>): Promise<boolean> {
  //   if (this.editableRange === 'public') return true;
  //   if (this.editableRange === 'link') return true;

  //   const isMember = !!(await this.members)?.find((member) => member.id === user.id);
  //   const isOwner = (await this.owner)?.id === user.id;

  //   if (this.editableRange === 'member') return isMember || isOwner;
  //   return isOwner;
  // }

  // async getAvailableActions(user: z.infer<typeof UserSchema.response>): Promise<WorkspaceAction[]> {
  //   const result: WorkspaceAction[] = ['CREATE'];

  //   const [
  //     read,
  //     update,
  //     deleteAction,
  //     visible,
  //     editable,
  //   ] = await Promise.all([
  //     this.canRead(user),
  //     this.canUpdate(user),
  //     this.canDelete(user),
  //     this.canVisible(user),
  //     this.canEditable(user),
  //   ]);

  //   if (read) result.push('READ');
  //   if (update) result.push('UPDATE');
  //   if (deleteAction) result.push('DELETE');
  //   if (visible) result.push('VISIBLE');
  //   if (editable) result.push('EDITABLE');

  //   return result;
  // }


  static override async toResponse(
    memo: Memo,
    {
      withWorkspace = false,
      withAvailableActions = undefined,
    }: ToMemoResponseOptions = {},
  ): Promise<MemoResponse> {
    const doc = new Y.Doc();

    if (memo.content) Y.applyUpdate(doc, memo.content);
    const json = TiptapTransformer.fromYdoc(doc);

    const result: MemoResponse = {
      id: memo.id,
      name: memo.name,
      // content: generateHTML(doc),
      image: memo.image,
      ...await super.toResponse(memo),
    };

    if (withWorkspace) {
      let options = {};
      if (typeof withWorkspace !== 'boolean') options = withWorkspace;

      result.workspace = await WorkspaceDAO.toResponse(await memo.workspace, options);
    }
    // if (withAvailableActions) result.availableActions = await memo.getAvailableActions(withAvailableActions);

    return result;
  }

  static async toTreeResponse(
    memo: Memo,
    {
      withWorkspace = false,
      withAvailableActions = undefined,
    }: ToMemoResponseOptions = {},
  ): Promise<MemoTreeResponse> {
    const result: MemoTreeResponse = await this.toResponse(memo, { withWorkspace, withAvailableActions });

    if (memo.parent) result.parent = await MemoDAO.toTreeResponse(await fromLazy(memo.parent));
    if (memo.children) result.children = await Promise.all(
      (await fromLazy(memo.children)).map((child) => MemoDAO.toTreeResponse(child)),
    );

    return result;
  }
}
