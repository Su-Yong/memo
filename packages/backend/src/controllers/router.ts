import { Router } from 'express';

import { ping } from './ping';
import { userRouter } from '../domains/users/controllers/index';
import { workspaceRouter } from '../domains/workspaces/controllers/index';
import { fileRouter } from '../domains/files/controllers/index';
import { getMemoRouter } from '../domains/memos/controllers/index';

export const getRouter = () => {
  const router = Router();

  router.get('/ping', ping);
  router.use('/users', userRouter);
  router.use('/workspaces', workspaceRouter);
  router.use('/files', fileRouter);
  router.use('/', getMemoRouter());

  return router;
};
