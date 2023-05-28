import { NextFunction } from 'express';
import { WebSocket } from 'ws';
import { ContextRequest } from '../../../middlewares/Middleware';
import { useAccessToken } from '@/controllers/useAccessToken';
import { Memo } from '../models/Memo.model';
import { CommonError } from '@/models/Error';

export const editMemo = async (ws: WebSocket, request: ContextRequest, next: NextFunction) => {
  const memoRepository = request.db.getTreeRepository(Memo);

  const memo = await memoRepository.findOne({
    where: { id: request.params.document },
    relations: ['workspace', 'workspace.members', 'workspace.owner'],
  });
  if (memo) request.editorServer.handleConnection(ws, request);
  // else throw CommonError.MEMO_NOT_FOUND();
  // if (!memo.canUpdate(token)) throw CommonError.MEMO_NOT_ALLOWED_RESOURCE();
};