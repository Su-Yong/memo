import { Router } from 'express';
import { createMemo } from './createMemo';
import { getMemo, getMemos } from './getMemo';
import { editMemo } from './memo';
import { WebsocketRequestHandler } from 'express-ws';
import { updateMemo } from './updateMemo';
import { deleteMemo } from './deleteMemo';

export const getMemoRouter = () => {
  const memoRouter = Router({ mergeParams: true });

  memoRouter.post('/memos', createMemo);
  memoRouter.patch('/memos/:id', updateMemo);
  memoRouter.get('/memos/:id', getMemo);
  memoRouter.delete('/memos/:id', deleteMemo);
  memoRouter.get('/workspaces/:workspaceId/memos', getMemos);
  memoRouter.ws('/memos/:document', editMemo as WebsocketRequestHandler);

  return memoRouter;
};
