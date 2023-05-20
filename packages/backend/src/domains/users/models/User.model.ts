import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export type UserPermission = 'admin' | 'member' | 'guest';

@Entity()
export class User {
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
}
