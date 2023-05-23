import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { createController } from '../../../controllers/Controller.js';
import { User } from '../../users/models/User.model.js';
import { Workspace } from '../models/Workspace.model.js';
import WorkspaceSchema from '../models/Workspace.schema.js';
import { CommonError } from '../../../models/Error.js';

export const addMemberToWorkspace = createController(async ({ context, useRepository, useResponse, useRequestBody, useParams }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(WorkspaceSchema.member);
  const workspaceRepository = useRepository(Workspace);
  const userRepository = useRepository(User);
  const params = useParams();

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const workspace = await workspaceRepository.findOne({
    where: {
      id: Number(params.id)
    },
    relations: ['members', 'owner'],
  });
  if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();

  if (!(await workspace.canUpdate(user))) throw CommonError.WORKSPACE_NOT_ALLOWED_RESOURCE(403, 'Only owner can add members to workspace');

  const member = await userRepository.findOneBy({ id: body.memberId });
  if (!member) throw CommonError.USER_NOT_FOUND(404, 'Member not found');

  const originalMembers = await workspace.members ?? [];
  if (originalMembers.some((it) => it.id === user.id)) throw CommonError.USER_ALREADY_EXIST(407, 'this member already exists');

  workspace.members = [...originalMembers, member];
  workspace.mark(user);

  const result = await workspaceRepository.save(workspace);

  useResponse(
    200,
    await WorkspaceSchema.toResponse(result, { withMembers: true }),
  );
});

export const removeMemberToWorkspace = createController(async ({ context, useRepository, useResponse, useRequestBody, useParams }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(WorkspaceSchema.member);
  const workspaceRepository = useRepository(Workspace);
  const userRepository = useRepository(User);
  const params = useParams();

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const workspace = await workspaceRepository.findOne({
    where: {
      id: Number(params.id)
    },
    relations: ['members', 'owner'],
  });
  if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();

  if (!(await workspace.canUpdate(user))) throw CommonError.WORKSPACE_NOT_ALLOWED_RESOURCE(403, 'Only owner can add members to workspace');

  const member = await workspaceRepository.findOne({
    where: {
      members: {
        id: body.memberId,
      },
    },
  });
  if (!member) throw CommonError.USER_NOT_FOUND(404, 'Member not found');

  workspace.members = (await workspace.members ?? []).filter((m) => m.id !== member.id);
  workspace.mark(user);

  const result = await workspaceRepository.save(workspace);

  useResponse(
    200,
    await WorkspaceSchema.toResponse(result, { withMembers: true }),
  );
});
