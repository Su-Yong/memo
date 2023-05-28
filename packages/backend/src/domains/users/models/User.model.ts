import { Workspace } from '../../workspaces/models/Workspace.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import UserSchema from './User.schema';
import { z } from 'zod';
import { registerModel } from '@/models/model';

export type UserPermission = 'admin' | 'member' | 'guest';

@registerModel
@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  profile?: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'member', 'guest'],
    default: 'guest'
  })
  permission!: UserPermission;

  @ManyToMany(() => Workspace, workspace => workspace.members)
  workspaces!: Promise<Workspace[]>;

  // TODO: Implement this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async canRead(user: z.infer<typeof UserSchema.response>) {
    return true;
  }

  async canUpdate(user: z.infer<typeof UserSchema.response>) {
    return user.id === this.id || user.permission === 'admin';
  }
}

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  profile?: string;
  permission: UserPermission;
}
