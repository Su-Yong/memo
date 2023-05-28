import { CommonError } from '../../../models/Error';
import { createController } from '../../../controllers/Controller';
import { useAccessToken } from '../../../controllers/useAccessToken';
import { Workspace } from '../models/Workspace.model';
import WorkspaceSchema from '../models/Workspace.schema';

export const getWorkspace = createController(async ({ context, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const params = useParams();

  if (params.id === 'my') {
    const repository = useRepository(Workspace);
    const workspaces = await repository.find({
      where: {
        members: {
          id: token.id
        }
      },
      relations: ['members', 'owner'],
    });

    const result = workspaces.map((workspace) => WorkspaceSchema.toResponse(workspace, { withMembers: true, withAvailableActions: token }));

    useResponse(
      200,
      await Promise.all(result),
    );
  } else {
    const repository = useRepository(Workspace);

    const workspace = await repository.findOne({
      where: { id: Number(params.id) },
      relations: ['members', 'owner'],
    });

    if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();
    if (!await workspace.canRead(token)) throw CommonError.WORKSPACE_NOT_ALLOWED_RESOURCE();

    useResponse(
      200,
      await WorkspaceSchema.toResponse(workspace, { withMembers: true, withAvailableActions: token }),
    );
  }

});
