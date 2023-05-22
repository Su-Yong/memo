import { createController } from '../../../controllers/Controller.js';
import multer from 'multer';
import createHttpError from 'http-errors';
import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { FileMetadata } from '../models/FileMetadata.model.js';
import { v4 } from 'uuid';
import path from 'node:path';
import { User } from '../../users/models/User.model.js';
import FileMetadataSchema from '../models/FileMetadata.schema.js';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const folderPath = req.config?.server?.filePath ?? 'files/';

    callback(null, folderPath);
  },
  filename(req, file, callback) {
    callback(null, v4());
  },
});
const upload = multer({
  storage,
  fileFilter(req, file, callback) {
    try {
      // @ts-expect-error context injection
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useAccessToken({ request: req });

      callback(null, true);
    } catch (error) {
      callback(createHttpError('401', 'Invalid access token'));
    }
  },
});

export const uploadFile = [
  upload.single('file'),
  createController(async ({ useRequest, useRequestBody, useRepository, context, useResponse }) => {
    const request = useRequest();
    const body = useRequestBody(FileMetadataSchema.create);
    const token = useAccessToken(context);
    const userRepository = useRepository(User);
    const fileMetadataRepository = useRepository(FileMetadata);

    const user = await userRepository.findOneBy({ id: token.id });
    if (!user) throw createHttpError(404, 'User not found');

    if (!request.file) throw createHttpError(400, 'File not found');

    const fileMetadata = new FileMetadata();
    fileMetadata.id = request.file.filename;
    fileMetadata.fileName = body.fileName ?? request.file.originalname;
    fileMetadata.mark(user);
    console.log('check', fileMetadata);

    const result = await fileMetadataRepository.save(fileMetadata);

    useResponse(201, await FileMetadataSchema.toResponse(result));
  }),
];
