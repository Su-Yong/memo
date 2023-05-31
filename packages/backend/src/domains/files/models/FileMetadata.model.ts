import { Column, Entity, PrimaryColumn } from 'typeorm';
import { z } from 'zod';
import { registerModel } from '@/models/model';
import { CreatableDAO } from '@/models/Common';
import { FileMetadata, FileMetadataResponse, UserSchema } from '@suyong/memo-core';

@registerModel
@Entity({ name: 'file_metadata' })
export class FileMetadataDAO extends CreatableDAO {
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

  static override async toResponse(fileMetadata: FileMetadata): Promise<FileMetadataResponse> {
    return {
      id: fileMetadata.id,
      fileName: fileMetadata.fileName,
      mimeType: fileMetadata.mimeType,
      md5: fileMetadata.md5,
      ...await super.toResponse(fileMetadata),
    };
  }
}
