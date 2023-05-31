import { UserDAO } from '@/domains/users/models/User.model';
import { createController } from '../../../controllers/Controller';
import { useAccessToken } from '../../../controllers/useAccessToken';
import { CommonError } from '../../../models/Error';
import { WorkspaceSchema } from '@suyong/memo-core';
import { WorkspaceDAO } from '../models/Workspace.model';

export const updateWorkspace = createController(async ({ context, useRepository, useResponse, useRequestBody, useParams }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(WorkspaceSchema.update);
  const workspaceRepository = useRepository(WorkspaceDAO);
  const userRepository = useRepository(UserDAO);
  const params = useParams();

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const workspaceId = Number(params.id);
  const workspace = await workspaceRepository.findOne({
    where: {
      id: workspaceId
    },
    relations: ['members', 'owner'],
  });

  if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();
  if (!(await workspace.canUpdate(token))) throw CommonError.WORKSPACE_NOT_ALLOWED_RESOURCE(403, 'Only the owner can update the workspace');

  if (body.name) workspace.name = body.name;
  if (body.description) workspace.description = body.description;
  if (body.image) workspace.image = body.image;
  if (body.visibleRange) workspace.visibleRange = body.visibleRange;
  if (body.editableRange) workspace.editableRange = body.editableRange;
  workspace.mark(user);

  const result = await workspaceRepository.save(workspace);

  useResponse(
    200,
    await WorkspaceDAO.toResponse(result, { withMembers: true, withAvailableActions: token }),
  );
});
