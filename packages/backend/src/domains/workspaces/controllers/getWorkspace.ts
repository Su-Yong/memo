import { CommonError } from '../../../models/Error';
import { createController } from '../../../controllers/Controller';
import { useAccessToken } from '../../../controllers/useAccessToken';
import { WorkspaceDAO } from '../models/Workspace.model';

export const getWorkspace = createController(async ({ context, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const params = useParams();

  if (params.id === 'my') {
    const repository = useRepository(WorkspaceDAO);
    const workspaces = await repository.find({
      where: {
        members: {
          id: token.id
        }
      },
      relations: ['members', 'owner'],
    });

    const result = workspaces.map((workspace) => WorkspaceDAO.toResponse(workspace, { withMembers: true, withAvailableActions: token }));

    useResponse(
      200,
      await Promise.all(result),
    );
  } else {
    const repository = useRepository(WorkspaceDAO);

    const workspace = await repository.findOne({
      where: { id: Number(params.id) },
      relations: ['members', 'owner'],
    });

    if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();
    if (!await workspace.canRead(token)) throw CommonError.WORKSPACE_NOT_ALLOWED_RESOURCE();

    useResponse(
      200,
      await WorkspaceDAO.toResponse(workspace, { withMembers: true, withAvailableActions: token }),
    );
  }

});
