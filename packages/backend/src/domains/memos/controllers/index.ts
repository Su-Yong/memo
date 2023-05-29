import { Router } from 'express';
import { createMemo } from './createMemo';
import { getMemo, getMemos } from './getMemo';
import { editMemo } from './memo';
import { WebsocketRequestHandler } from 'express-ws';
import { updateMemo } from './updateMemo';

export const getMemoRouter = () => {
  const memoRouter = Router({ mergeParams: true });

  memoRouter.post('/memos', createMemo);
  memoRouter.patch('/memos/:id', updateMemo);
  memoRouter.get('/workspaces/:workspaceId/memos', getMemos);
  memoRouter.get('/memos/:id', getMemo);
  memoRouter.ws('/memos/:document', editMemo as WebsocketRequestHandler);

  return memoRouter;
};
