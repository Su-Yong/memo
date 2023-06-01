import path from 'node:path';
import fs from 'node:fs';
import { createController } from '../../../controllers/Controller';
import { CommonError } from '../../../models/Error';
import { FileMetadataDAO } from '../models/FileMetadata.model';

export const getFile = createController(async ({ context, useConfig, useParams, useRepository }) => {
  const params = useParams();
  const config = useConfig();
  const fileMetadataRepository = useRepository(FileMetadataDAO);

  const fileId = params.id;
  const filePath = path.join(config.server.filePath, fileId);

  const fileMetadata = await fileMetadataRepository.findOneBy({ id: fileId });
  if (!fileMetadata) throw CommonError.FILE_NOT_FOUND();

  const stream = fs.createReadStream(filePath);
  stream.on('open', () => {
    context.response.set('Content-Type', fileMetadata.mimeType);
    context.response.set('cache-control', 'max-age=31536000');
    stream.pipe(context.response);
  });
  stream.on('error', () => {
    throw CommonError.FILE_NOT_FOUND();
  });
});
