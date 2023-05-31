import { createController } from '../../../controllers/Controller';
import multer from 'multer';
import { useAccessToken } from '../../../controllers/useAccessToken';
import { v4 } from 'uuid';
import md5 from 'md5';
import fs from 'node:fs/promises';
import { CommonError } from '../../../models/Error';
import { UserDAO } from '@/domains/users/models/User.model';
import { FileMetadataSchema } from '@suyong/memo-core';
import { FileMetadataDAO } from '../models/FileMetadata.model';

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
  fileFilter(request, _, callback) {
    (async () => {
      if (!request.db) throw CommonError.INTERNAL_SERVER_ERROR(500, 'Database not found');

      // @ts-expect-error context injection
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const token = useAccessToken({ request });

      const userRepository = request.db.getRepository(UserDAO);

      const user = await userRepository.findOneBy({ id: token.id });
      if (!user) throw CommonError.USER_NOT_FOUND();

      callback(null, true);
    })().catch((err) => {
      if (err instanceof Error) callback(err);
      else callback(CommonError.COMMON_INVALID_BODY(400, 'Unknown error'));
    });
  },
});

export const uploadFile = [
  upload.single('file'),
  createController(async ({ useRequest, useRequestBody, useRepository, context, useResponse }) => {
    const request = useRequest();
    const body = useRequestBody(FileMetadataSchema.create);
    const token = useAccessToken(context);
    const userRepository = useRepository(UserDAO);
    const fileMetadataRepository = useRepository(FileMetadataDAO);

    const user = await userRepository.findOneBy({ id: token.id });
    if (!user) throw CommonError.USER_NOT_FOUND();

    if (!request.file) throw CommonError.FILE_NOT_FOUND();
    const buffer = await fs.readFile(request.file.path);
    const hash = md5(buffer);
    const alreadyExistFile = await fileMetadataRepository.findOne({
      where: {
        md5: hash,
      },
    });

    if (alreadyExistFile) {
      await fs.unlink(request.file.path);

      useResponse(200, await FileMetadataDAO.toResponse(alreadyExistFile));
      return;
    }

    const fileMetadata = new FileMetadataDAO();
    fileMetadata.id = request.file.filename;
    fileMetadata.fileName = body.fileName ?? request.file.originalname;
    fileMetadata.md5 = hash;
    fileMetadata.mimeType = request.file.mimetype;
    fileMetadata.mark(user);

    const result = await fileMetadataRepository.save(fileMetadata);

    useResponse(200, await FileMetadataDAO.toResponse(result));
  }),
];
