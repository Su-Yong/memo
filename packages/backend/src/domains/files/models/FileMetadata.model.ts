import { Creatable } from '../../../models/Common.js';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FileMetadata extends Creatable {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  fileName!: string;
}
