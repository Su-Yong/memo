import { Entity, CreateDateColumn, UpdateDateColumn, BaseEntity, JoinColumn, ManyToOne } from 'typeorm';
import type { Creatable, CreatableResponse, Modifiable, ModifiableResponse, User } from '@suyong/memo-core';
import { UserDAO } from '@/domains/users/models/User.model';

@Entity()
export class CreatableDAO extends BaseEntity implements Creatable {
  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('UserDAO', { eager: true, nullable: true })
  @JoinColumn()
  createdBy?: User;

  mark(user: User) {
    if (!this.createdBy) this.createdBy = user;
  }

  static async toResponse(creatable: Creatable): Promise<CreatableResponse> {
    return {
      createdAt: creatable.createdAt,
      createdBy: creatable.createdBy ? UserDAO.toResponse(creatable.createdBy) : undefined,
    };
  }
}

@Entity()
export class ModifiableDAO extends CreatableDAO implements Modifiable {
  @UpdateDateColumn()
  lastModifiedAt!: Date;

  @ManyToOne('UserDAO', { eager: true, nullable: true })
  @JoinColumn()
  lastModifiedBy?: User;

  override mark(user: User) {
    super.mark(user);

    this.lastModifiedBy = user;
  }

  static override async toResponse(modifiable: Modifiable): Promise<ModifiableResponse> {
    return {
      ...super.toResponse(modifiable),
      lastModifiedAt: modifiable.lastModifiedAt,
      lastModifiedBy: modifiable.lastModifiedBy ? UserDAO.toResponse(modifiable.lastModifiedBy) : undefined,
    };
  }
}
