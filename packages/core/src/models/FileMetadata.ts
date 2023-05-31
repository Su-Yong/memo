import { z } from 'zod';
import { CreatableSchema } from './Common';

export type FileMetadataRequest = z.infer<typeof FileMetadataSchema.create>;
export type FileMetadataResponse = z.infer<typeof FileMetadataSchema.response>;

export class FileMetadataSchema extends CreatableSchema {
  static create = z.object({
    fileName: z.string().optional(),
  });

  static override response = CreatableSchema.response.extend({
    id: z.string(),
    fileName: z.string(),
    mimeType: z.string(),
    md5: z.string(),
  });
}
