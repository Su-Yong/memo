import { Router } from 'express';
import { createUser } from './createUser.js';
import { loginUser } from './loginUser.js';
import { refreshUser } from './refreshUser.js';
import { updateUser } from './updateUser.js';
import { getUser } from './getUser.js';

export const userRouter = Router({ mergeParams: true });

userRouter.post('/', createUser);
userRouter.get('/', getUser);
userRouter.patch('/', updateUser);
userRouter.patch('/:email', updateUser);
userRouter.get('/:email', getUser);
userRouter.post('/login', loginUser);
userRouter.post('/refresh', refreshUser);
