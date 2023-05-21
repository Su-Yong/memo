import UserSchema from '../../users/models/User.schema.js';
import { User } from '../../users/models/User.model.js';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, BaseEntity, JoinColumn } from 'typeorm'
import { z } from 'zod';

@Entity()
export class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

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
}
