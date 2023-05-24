import { Router } from 'express';
import { createMemo } from './createMemo.js';
import { getMemo, getMemos } from './getMemo.js';

export const memoRouter = Router({ mergeParams: true });

memoRouter.post('/', createMemo);
memoRouter.get('/', getMemos);
memoRouter.get('/:id', getMemo);
