import { NextFunction } from 'express';
import { WebSocket } from 'ws';
import { ContextRequest } from '../../../middlewares/Middleware';

export const editMemo = async (ws: WebSocket, request: ContextRequest, next: NextFunction) => {
  console.log('websocket connected!!!');

  request.editorServer.handleConnection(ws, request);
};