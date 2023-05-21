import { Router } from 'express';
import { getWorkspace } from './getWorkspace.js';
import { createWorkspace } from './createWorkspace.js';

export const workspaceRouter = Router({ mergeParams: true });

workspaceRouter.post('/', createWorkspace);
workspaceRouter.get('/:id', getWorkspace);
