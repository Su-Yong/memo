import { Router } from 'express';

import { ping } from './ping.js';
import { userRouter } from '../domains/users/controllers/index.js';

const router = Router();

router.get('/ping', ping);
router.use('/users', userRouter);

export default router;
