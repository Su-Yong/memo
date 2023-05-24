import { Router } from 'express';
import { createMemo } from './createMemo.js';
import { getMemo, getMemos } from './getMemo.js';

export const memoRouter = Router({ mergeParams: true });

memoRouter.post('/memos', createMemo);
memoRouter.get('/workspaces/:workspaceId/memos', getMemos);
memoRouter.get('/memos/:id', getMemo);
