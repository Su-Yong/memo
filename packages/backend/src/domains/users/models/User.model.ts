import { Workspace } from '../../workspaces/models/Workspace.model.js';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'

export type UserPermission = 'admin' | 'member' | 'guest';

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

  @Column({
    type: 'enum',
    enum: ['admin', 'member', 'guest'],
    default: 'guest'
  })
  permission!: UserPermission;

  @ManyToMany(() => Workspace, workspace => workspace.members)
  workspaces!: Promise<Workspace[]>;
}

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  permission: UserPermission;
}
