import { Router } from 'express';
import { createMemo } from './createMemo';
import { getMemo, getMemos } from './getMemo';
import { editMemo } from './memo';
import { WebsocketRequestHandler } from 'express-ws';

export const getMemoRouter = () => {
  const memoRouter = Router({ mergeParams: true });

  memoRouter.post('/memos', createMemo);
  memoRouter.get('/workspaces/:workspaceId/memos', getMemos);
  memoRouter.get('/memos/:id', getMemo);
  memoRouter.ws('/memos/:id', editMemo as WebsocketRequestHandler);

  return memoRouter;
};
