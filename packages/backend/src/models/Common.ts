import { User } from '../domains/users/models/User.model.js';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';

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
