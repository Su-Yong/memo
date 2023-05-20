import { Router } from 'express';
import { createUser } from './createUser.js';

export const userRouter = Router({ mergeParams: true });

userRouter.post('/', createUser);
