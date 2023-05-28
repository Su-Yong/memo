import createHttpError from 'http-errors';
import { createController } from '../../../controllers/Controller';
import { useAccessToken } from '../../../controllers/useAccessToken';
import { Workspace } from '../models/Workspace.model';
import { CommonError } from '../../../models/Error';

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

  if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();
  if (!(await workspace.canDelete(token))) throw createHttpError(403, 'Only the owner can delete the workspace');

  await workspaceRepository.delete(workspace.id);

  useResponse(204);
});
