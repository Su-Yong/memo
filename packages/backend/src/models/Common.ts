import { z } from 'zod';
import { User } from '../domains/users/models/User.model.js';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import UserSchema from '../domains/users/models/User.schema.js';

@Entity()
export class Creatable {
  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => User, (user) => user.id)
  @Column({ nullable: true })
  createdBy?: User;
}

@Entity()
export class Modifiable extends Creatable {
  @UpdateDateColumn()
  lastModifiedAt!: Date;

  @OneToOne(() => User, (user) => user.id)
  @Column({ nullable: true })
  lastModifiedBy?: User;
}

export const CreatableSchema = z.object({
  createdAt: z.date(),
  createdBy: UserSchema.response.optional(),
});

export const ModifiableSchema = CreatableSchema.extend({
  createdAt: z.date(),
  createdBy: UserSchema.response.optional(),
});

export type AvailableAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
export const AvailableActionsSchema = z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE']).array();
