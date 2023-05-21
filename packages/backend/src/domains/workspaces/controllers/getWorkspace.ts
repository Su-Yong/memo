import { createController } from '../../../controllers/Controller.js';
import { useAccessToken } from '../../../controllers/useAccessToken.js';
// import { User } from '../../users/models/User.model.js';
import createHttpError from 'http-errors';
import { Workspace } from '../models/Workspace.model.js';
import WorkspaceSchema from '../models/Workspace.schema.js';
// import { In } from 'typeorm';

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

    const result = workspaces.map((workspace) => WorkspaceSchema.toResponse(workspace, true));

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

    if (!workspace) throw createHttpError(404, 'Workspace not found');
    if (!await workspace.canRead(token)) throw createHttpError(403, 'You are not allowed to read this workspace');

    useResponse(
      200,
      await WorkspaceSchema.toResponse(workspace, true),
    );
  }

});
