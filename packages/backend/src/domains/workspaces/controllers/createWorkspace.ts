import { createController } from '../../../controllers/Controller.js';
import { useAccessToken } from '../../../controllers/useAccessToken.js';
import WorkspaceSchema from '../models/Workspace.schema.js';
import { Workspace } from '../models/Workspace.model.js';
import { User } from '../../users/models/User.model.js';
import { CommonError } from '../../../models/Error.js';

export const createWorkspace = createController(async ({ context, useRepository, useResponse, useRequestBody }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(WorkspaceSchema.create);
  const workspaceRepository = useRepository(Workspace);
  const userRepository = useRepository(User);

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const workspace = new Workspace();
  workspace.name = body.name;
  workspace.description = body.description;
  workspace.owner = user;
  workspace.members = [user];
  workspace.mark(user);

  const result = await workspaceRepository.save(workspace);

  useResponse(
    201,
    await WorkspaceSchema.toResponse(result, { withMembers: true, withAvailableActions: user }),
  );
});
