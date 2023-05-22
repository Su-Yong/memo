import path from 'node:path';
import fs from 'node:fs';
import { createController } from '../../../controllers/Controller.js';
import createHttpError from 'http-errors';
import { FileMetadata } from '../models/FileMetadata.model.js';

export const getFile = createController(async ({ context, useConfig, useParams, useRepository }) => {
  const params = useParams();
  const config = useConfig();
  const fileMetadataRepository = useRepository(FileMetadata);

  const fileId = params.id;
  const filePath = path.join(config.server.filePath, fileId);

  const fileMetadata = await fileMetadataRepository.findOneBy({ id: fileId });
  if (!fileMetadata) throw createHttpError(404, 'File not found');

  const stream = fs.createReadStream(filePath);
  stream.on('open', () => {
    context.response.set('Content-Type', fileMetadata.mimeType);
    stream.pipe(context.response);
  });
  stream.on('error', () => {
    throw createHttpError(404, 'File not found');
  });
});
