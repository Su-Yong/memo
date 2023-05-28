import { Router } from 'express';
import { createUser } from './createUser';
import { loginUser } from './loginUser';
import { refreshUser } from './refreshUser';
import { updateUser } from './updateUser';
import { getUser } from './getUser';

export const userRouter = Router({ mergeParams: true });

userRouter.post('/', createUser);
userRouter.get('/', getUser);
userRouter.patch('/', updateUser);
userRouter.patch('/:email', updateUser);
userRouter.get('/:email', getUser);
userRouter.post('/login', loginUser);
userRouter.post('/refresh', refreshUser);
