import { Router } from 'express';
import { createUser } from './createUser.js';
import { loginUser } from './loginUser.js';
import { refreshUser } from './refreshUser.js';

export const userRouter = Router({ mergeParams: true });

userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/refresh', refreshUser);
