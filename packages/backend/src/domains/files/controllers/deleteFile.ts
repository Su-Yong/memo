import path from 'node:path';
import fs from 'node:fs/promises';
import { createController } from '../../../controllers/Controller.js';
import { FileMetadata } from '../models/FileMetadata.model.js';
import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { User } from '../../users/models/User.model.js';
import { CommonError } from '../../../models/Error.js';

export const deleteFile = createController(async ({ context, useConfig, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const fileMetadataRepository = useRepository(FileMetadata);
  const userRepository = useRepository(User);
  const params = useParams();
  const config = useConfig();

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const fileId = params.id;
  const fileMetadata = await fileMetadataRepository.findOneBy({ id: fileId });
  if (!fileMetadata) throw CommonError.FILE_NOT_FOUND();

  if (!await fileMetadata.canDelete(user)) throw CommonError.FILE_NOT_ALLOWED_RESOURCE();

  await fs.unlink(path.join(config.server.filePath, fileId));
  await fileMetadataRepository.delete(fileMetadata.id);

  useResponse(204);
});
