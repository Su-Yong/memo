import UserSchema from 'src/domains/users/models/User.schema.js';
import { Creatable } from '../../../models/Common.js';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { z } from 'zod';

@Entity()
export class FileMetadata extends Creatable {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  fileName!: string;

  @Column()
  md5!: string;

  async canUpdate(user: z.infer<typeof UserSchema.response>) {
    return user.permission === 'admin' || user.id === this.createdBy?.id;
  }
  
  canDelete = this.canUpdate;
}
