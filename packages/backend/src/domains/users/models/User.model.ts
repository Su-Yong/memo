import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import { registerModel } from '@/models/model';
import type{ User, UserResponse, Workspace } from '@suyong/memo-core';

export type UserPermission = 'admin' | 'member' | 'guest';

@registerModel
@Entity({ name: 'user' })
export class UserDAO implements User {
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

  @ManyToMany('WorkspaceDAO', (workspace: Workspace) => workspace.members)
  workspaces!: Promise<Workspace[]> | Workspace[];

  // permissions
  // TODO: Implement this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async canRead(user: User) {
    return true;
  }

  async canUpdate(user: User) {
    return user.id === this.id || user.permission === 'admin';
  }

  // utils
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profile: user.profile,
      permission: user.permission,
    };
  }
}
