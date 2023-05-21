import { User } from '../../users/models/User.model.js';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, BaseEntity, JoinColumn } from 'typeorm'

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
}
