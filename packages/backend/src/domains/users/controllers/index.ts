import { Router } from 'express';
import { createUser } from './createUser.js';
import { loginUser } from './loginUser.js';
import { refreshUser } from './refreshUser.js';
import { updateUser } from './updateUser.js';

export const userRouter = Router({ mergeParams: true });

userRouter.post('/', createUser);
userRouter.patch('/:email', updateUser);
userRouter.post('/login', loginUser);
userRouter.post('/refresh', refreshUser);
