import { WorkspaceSchema, Workspace, User } from '@suyong/memo-core';
import { createController } from '../../../controllers/Controller';
import { useAccessToken } from '../../../controllers/useAccessToken';
import { CommonError } from '../../../models/Error';
import { WorkspaceDAO } from '../models/Workspace.model';
import { UserDAO } from '@/domains/users/models/User.model';

export const createWorkspace = createController(async ({ context, useRepository, useResponse, useRequestBody }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(WorkspaceSchema.create);
  const workspaceRepository = useRepository(WorkspaceDAO);
  const userRepository = useRepository(UserDAO);

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const workspace = new WorkspaceDAO();
  workspace.name = body.name;
  workspace.description = body.description;
  workspace.owner = user;
  workspace.members = [user];
  workspace.mark(user);

  const result = await workspaceRepository.save(workspace);

  useResponse(
    201,
    await WorkspaceDAO.toResponse(
      result,
      {
        withMembers: true,
        withAvailableActions: user,
      },
    ),
  );
});
