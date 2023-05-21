import createHttpError from 'http-errors';
import { createController } from '../../../controllers/Controller.js';
import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { Workspace } from '../models/Workspace.model.js';
import WorkspaceSchema from '../models/Workspace.schema.js';

export const updateWorkspace = createController(async ({ context, useRepository, useResponse, useRequestBody, useParams }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(WorkspaceSchema.update);
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
  if (!(await workspace.canUpdate(token))) throw createHttpError(403, 'Only the owner can update the workspace');

  if (body.name) workspace.name = body.name;
  if (body.description) workspace.description = body.description;
  if (body.image) workspace.image = body.image;
  if (body.visibleRange) workspace.visibleRange = body.visibleRange;
  if (body.editableRange) workspace.editableRange = body.editableRange;

  const result = await workspaceRepository.save(workspace);

  useResponse(
    200,
    await WorkspaceSchema.toResponse(result, { withMembers: true, withAvailableActions: token }),
  );
});