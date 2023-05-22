import { z } from 'zod';
import type { IUser } from '../domains/users/models/User.model.js';
import { Entity, CreateDateColumn, UpdateDateColumn, OneToOne, BaseEntity, JoinColumn } from 'typeorm';
import UserSchema from '../domains/users/models/User.schema.js';

@Entity()
export class Creatable extends BaseEntity {
  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne('User', { eager: true, nullable: true })
  @JoinColumn()
  createdBy?: IUser;

  mark(user: IUser) {
    if (!this.createdBy) this.createdBy = user;
  }
}

@Entity()
export class Modifiable extends Creatable {
  @UpdateDateColumn()
  lastModifiedAt!: Date;

  @OneToOne('User', { eager: true, nullable: true })
  @JoinColumn()
  lastModifiedBy?: IUser;

  override mark(user: IUser) {
    super.mark(user);
    this.lastModifiedBy = user;
  }
}

export class CreatableSchema {
  static response = z.object({
    createdAt: z.date(),
    createdBy: UserSchema.response.optional(),
  });

  static async toResponse(creatable: Creatable): Promise<z.infer<typeof this.response>> {
    return {
      createdAt: creatable.createdAt,
      createdBy: creatable.createdBy ? UserSchema.toResponse(creatable.createdBy) : undefined,
    };
  }
}

export class ModifiableSchema extends CreatableSchema {
  static override response  = CreatableSchema.response.extend({
    lastModifiedAt: z.date(),
    lastModifiedBy: UserSchema.response.optional(),
  });

  static override async toResponse(modifiable: Modifiable): Promise<z.infer<typeof this.response>> {
    return {
      ...await super.toResponse(modifiable),
      lastModifiedAt: modifiable.lastModifiedAt,
      lastModifiedBy: modifiable.lastModifiedBy ? UserSchema.toResponse(modifiable.lastModifiedBy) : undefined,
    };
  }
}

export type AvailableAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
export const AvailableActionsSchema = z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE']).array();
