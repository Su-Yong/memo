import path from 'node:path';
import { createController } from '../../../controllers/Controller.js';
import { useAccessToken } from '../../../controllers/useAccessToken.js';
import createHttpError from 'http-errors';

export const getFile = createController(async ({ context, useConfig, useParams }) => {
  useAccessToken(context);
  const params = useParams();
  const config = useConfig();

  const fileId = params.id;
  const filePath = path.join(config.server.filePath, fileId);

  await new Promise<void>((resolve, reject) => {
    context.response.sendFile(filePath, (err) => {
      if (err) {
        reject(createHttpError(404, 'File not found'));
      } else {
        resolve();
      }
    });
  });
});
