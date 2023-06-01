import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Tree, TreeChildren, TreeParent } from 'typeorm';
import { registerModel } from '@/models/model';
import { ModifiableDAO } from '@/models/Common';
import { AvailableActions, MemoResponse, Unlazy, WorkspaceSchema, extensions, fromLazy } from '@suyong/memo-core';
import type { Memo, User, UserSchema, Workspace, MemoTreeResponse } from '@suyong/memo-core';
import { ToWorkspaceResponseOptions, WorkspaceDAO } from '@/domains/workspaces/models/Workspace.model';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { generateHTML } from '@tiptap/html';
import * as Y from 'yjs';

export type ToMemoResponseOptions<Target extends Memo> = {
  withWorkspace?: boolean | ToWorkspaceResponseOptions<Unlazy<Target['workspace']>>;
} & (
  Target extends MemoDAO
    ? { withAvailableActions?: User }
    : { withAvailableActions?: undefined }
);

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

  async canRead(user: User): Promise<boolean> {
    if (this.visibleRange === 'public') return true;
    if (this.visibleRange === 'link') return true;

    const [
      isMember,
      isOwner
    ] = await Promise.all([
      !!(await (await this.workspace)?.members)?.find((member) => member.id === user.id),
      (await (await this.workspace)?.owner)?.id === user.id,
    ]);

    return isMember || isOwner;
  }

  async canUpdate(user: User): Promise<boolean> {
    if (this.visibleRange === 'public') return true;
    if (this.visibleRange === 'link') return true;

    const [
      isMember,
      isOwner
    ] = await Promise.all([
      !!(await (await this.workspace)?.members)?.find((member) => member.id === user.id),
      (await (await this.workspace)?.owner)?.id === user.id,
    ]);

    if (this.visibleRange === 'member') return isMember;
    if (this.visibleRange === 'owner') return isOwner;

    return isMember || isOwner;
  }

  canDelete = this.canUpdate;

  async getAvailableActions(user: User): Promise<AvailableActions> {
    const result: AvailableActions = ['CREATE'];

    const [
      read,
      update,
      deleteAction,
    ] = await Promise.all([
      this.canRead(user),
      this.canUpdate(user),
      this.canDelete(user),
    ]);

    if (read) result.push('READ');
    if (update) result.push('UPDATE');
    if (deleteAction) result.push('DELETE');

    return result;
  }

  static override async toResponse<Target extends Memo>(
    memo: Target,
    {
      withWorkspace = false,
      withAvailableActions = undefined,
    }: ToMemoResponseOptions<Target> = {},
  ): Promise<MemoResponse> {
    let content = '';

    try {
      const doc = new Y.Doc();

      if (memo.content) {
        Y.applyUpdate(doc, memo.content);
        const json = TiptapTransformer.fromYdoc(doc);

        content = generateHTML(json.default, extensions);
      }
    } catch {}

    const result: MemoResponse = {
      id: memo.id,
      name: memo.name,
      content,
      image: memo.image,
      ...await super.toResponse(memo),
    };

    if (withWorkspace) {
      let options = {};
      if (typeof withWorkspace !== 'boolean') options = withWorkspace;

      result.workspace = await WorkspaceDAO.toResponse(await memo.workspace, options);
    }
    if (withAvailableActions) result.availableActions = await ((await memo) as unknown as MemoDAO).getAvailableActions(withAvailableActions);

    return result;
  }

  static async toTreeResponse<Target extends Memo>(
    memo: Target,
    {
      withWorkspace = false,
      withAvailableActions = undefined,
    }: ToMemoResponseOptions<Target> = {},
  ): Promise<MemoTreeResponse> {
    const result: MemoTreeResponse = await this.toResponse(memo, { withWorkspace, withAvailableActions });

    if (memo.parent) result.parent = await MemoDAO.toTreeResponse(await fromLazy(memo.parent));
    if (memo.children) result.children = await Promise.all(
      (await fromLazy(memo.children)).map((child) => MemoDAO.toTreeResponse(child)),
    );

    return result;
  }
}
