import { Router } from 'express';
import { ping } from './ping.js';

const router = Router();

router.get('/ping', ping);

export default router;
