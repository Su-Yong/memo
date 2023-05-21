import { Router } from 'express';

import { ping } from './ping.js';
import { userRouter } from '../domains/users/controllers/index.js';
import { workspaceRouter } from '../domains/workspaces/controllers/index.js';

const router = Router();

router.get('/ping', ping);
router.use('/users', userRouter);
router.use('/workspaces', workspaceRouter);

export default router;
