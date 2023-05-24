import UserSchema from '../../users/models/User.schema.js';
import { Workspace, WorkspaceAction } from '../../workspaces/models/Workspace.model.js';
import { AvailableAction, Modifiable } from '../../../models/Common.js';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { z } from 'zod';

export type MemoAction = AvailableAction | 'VISIBLE' | 'EDITABLE';

@Entity()
export class Memo extends Modifiable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  content!: string;

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

  @ManyToOne(() => Workspace, workspace => workspace.memos)
  @JoinColumn()
  workspace!: Promise<Workspace> | Workspace;

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
}
