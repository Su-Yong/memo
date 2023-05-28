import UserSchema from '@/domains/users/models/User.schema';
import { Creatable } from '../../../models/Common';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { z } from 'zod';
import { registerModel } from '@/models/model';

@registerModel
@Entity()
export class FileMetadata extends Creatable {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  fileName!: string;

  @Column()
  mimeType!: string;

  @Column()
  md5!: string;

  async canUpdate(user: z.infer<typeof UserSchema.response>) {
    return user.permission === 'admin' || user.id === this.createdBy?.id;
  }

  canDelete = this.canUpdate;
}
