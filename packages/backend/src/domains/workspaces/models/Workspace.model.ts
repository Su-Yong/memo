import UserSchema from '../../users/models/User.schema.js';
import { User } from '../../users/models/User.model.js';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn, SaveOptions } from 'typeorm'
import { z } from 'zod';
import { AvailableAction, Modifiable } from '../../../models/Common.js';

export type WorkspaceAction = AvailableAction | 'VISIBLE' | 'EDITABLE';

@Entity()
export class Workspace extends Modifiable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

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

  @ManyToMany(() => User, user => user.workspaces)
  @JoinTable()
  members?: Promise<User[]> | User[];

  @ManyToOne(() => User)
  @JoinColumn()
  owner!: Promise<User> | User;

  async canRead(user: z.infer<typeof UserSchema.response>): Promise<boolean> {
    const isMember = !!(await this.members)?.find((member) => member.id === user.id);
    const isOwner = (await this.owner)?.id === user.id;

    return isMember || isOwner;
  }

  async canUpdate(user: z.infer<typeof UserSchema.response>): Promise<boolean> {
    const isOwner = (await this.owner)?.id === user.id;

    return isOwner || user.permission === 'admin';
  }

  canDelete = this.canUpdate;

  async canVisible(user: z.infer<typeof UserSchema.response>): Promise<boolean> {
    if (this.visibleRange === 'public') return true;
    if (this.visibleRange === 'link') return true;

    const isMember = !!(await this.members)?.find((member) => member.id === user.id);
    const isOwner = (await this.owner)?.id === user.id;

    return  isMember || isOwner;
  }

  async canEditable(user: z.infer<typeof UserSchema.response>): Promise<boolean> {
    if (this.editableRange === 'public') return true;
    if (this.editableRange === 'link') return true;

    const isMember = !!(await this.members)?.find((member) => member.id === user.id);
    const isOwner = (await this.owner)?.id === user.id;

    if (this.editableRange === 'member') return isMember || isOwner;
    return isOwner;
  }

  async getAvailableActions(user: z.infer<typeof UserSchema.response>): Promise<WorkspaceAction[]> {
    const result: WorkspaceAction[] = ['CREATE'];

    const [
      read,
      update,
      deleteAction,
      visible,
      editable,
    ] = await Promise.all([
      this.canRead(user),
      this.canUpdate(user),
      this.canDelete(user),
      this.canVisible(user),
      this.canEditable(user),
    ]);

    if (read) result.push('READ');
    if (update) result.push('UPDATE');
    if (deleteAction) result.push('DELETE');
    if (visible) result.push('VISIBLE');
    if (editable) result.push('EDITABLE');

    return result;
  }
}
