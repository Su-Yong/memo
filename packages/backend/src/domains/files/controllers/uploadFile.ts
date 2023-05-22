import { createController } from '../../../controllers/Controller.js';
import multer from 'multer';
import createHttpError from 'http-errors';
import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { FileMetadata } from '../models/FileMetadata.model.js';
import { v4 } from 'uuid';
import md5 from 'md5';
import fs from 'node:fs/promises';
import { User } from '../../users/models/User.model.js';
import FileMetadataSchema from '../models/FileMetadata.schema.js';

const storage = multer.diskStorage({
  destination(req, _, callback) {
    const folderPath = req.config?.server?.filePath ?? 'files/';

    callback(null, folderPath);
  },
  filename(_, __, callback) {
    callback(null, v4());
  },
});
const upload = multer({
  storage,
  fileFilter(request, file, callback) {
    (async () => {
      if (!request.db) throw createHttpError(500, 'Database not found');

      // @ts-expect-error context injection
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const token = useAccessToken({ request });

      const userRepository = request.db.getRepository(User);

      const user = await userRepository.findOneBy({ id: token.id });
      if (!user) throw createHttpError(404, 'User not found');

      callback(null, true);
    })().catch((err) => {
      if (err instanceof Error) callback(err);
      else callback(createHttpError(400, 'Unknown error'));
    });
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
    const buffer = await fs.readFile(request.file.path);
    const hash = md5(buffer);
    const alreadyExistFile = await fileMetadataRepository.findOne({
      where: {
        md5: hash,
      },
    });

    if (alreadyExistFile) {
      await fs.unlink(request.file.path);

      useResponse(200, await FileMetadataSchema.toResponse(alreadyExistFile));
      return;
    }

    const fileMetadata = new FileMetadata();
    fileMetadata.id = request.file.filename;
    fileMetadata.fileName = body.fileName ?? request.file.originalname;
    fileMetadata.md5 = hash;
    fileMetadata.mark(user);

    const result = await fileMetadataRepository.save(fileMetadata);

    useResponse(200, await FileMetadataSchema.toResponse(result));
  }),
];
