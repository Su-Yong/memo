import createHttpError from 'http-errors';
import { createController } from '../../../controllers/Controller.js';
import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { Workspace } from '../models/Workspace.model.js';

export const deleteWorkspace = createController(async ({ context, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const workspaceRepository = useRepository(Workspace);
  const params = useParams();

  const workspaceId = Number(params.id);
  const workspace = await workspaceRepository.findOne({
    where: {
      id: workspaceId
    },
    relations: ['members', 'owner'],
  });

  if (!workspace) throw createHttpError(404, 'Workspace not found');
  if (!(await workspace.canDelete(token))) throw createHttpError(403, 'Only the owner can delete the workspace');

  await workspaceRepository.delete(workspace.id);

  useResponse(204);
});
