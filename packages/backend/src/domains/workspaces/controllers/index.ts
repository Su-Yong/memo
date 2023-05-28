import { Router } from 'express';
import { getWorkspace } from './getWorkspace';
import { createWorkspace } from './createWorkspace';
import { addMemberToWorkspace, removeMemberToWorkspace } from './updateWorkspaceMember';
import { updateWorkspace } from './updateWorkspace';
import { deleteWorkspace } from './deleteWorkspace';

export const workspaceRouter = Router({ mergeParams: true });

workspaceRouter.post('/', createWorkspace);
workspaceRouter.get('/:id', getWorkspace);
workspaceRouter.patch('/:id', updateWorkspace);
workspaceRouter.delete('/:id', deleteWorkspace);
workspaceRouter.patch('/:id/members', addMemberToWorkspace);
workspaceRouter.delete('/:id/members', removeMemberToWorkspace);
