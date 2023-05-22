import { z } from 'zod';
import { CreatableSchema } from '../../../models/Common.js';
import { FileMetadata } from './FileMetadata.model.js';

class FileMetadataSchema extends CreatableSchema {
  static create = z.object({
    fileName: z.string().optional(),
  });

  static override response = CreatableSchema.response.extend({
    id: z.string(),
    fileName: z.string(),
  });

  static override async toResponse(fileMetadata: FileMetadata): Promise<z.infer<typeof this.response>> {
    return {
      id: fileMetadata.id,
      fileName: fileMetadata.fileName,
      ...await super.toResponse(fileMetadata),
    };
  }
}

export default FileMetadataSchema;
