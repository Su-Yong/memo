import { Router } from 'express';
import { getWorkspace } from './getWorkspace.js';
import { createWorkspace } from './createWorkspace.js';
import { addMemberToWorkspace, removeMemberToWorkspace } from './updateWorkspaceMember.js';
import { updateWorkspace } from './updateWorkspace.js';
import { deleteWorkspace } from './deleteWorkspace.js';

import { memoRouter } from '../../memos/controllers/index.js';

export const workspaceRouter = Router({ mergeParams: true });

workspaceRouter.post('/', createWorkspace);
workspaceRouter.get('/:id', getWorkspace);
workspaceRouter.patch('/:id', updateWorkspace);
workspaceRouter.delete('/:id', deleteWorkspace);
workspaceRouter.patch('/:id/members', addMemberToWorkspace);
workspaceRouter.delete('/:id/members', removeMemberToWorkspace);

workspaceRouter.use('/:workspaceId/memos', memoRouter);
