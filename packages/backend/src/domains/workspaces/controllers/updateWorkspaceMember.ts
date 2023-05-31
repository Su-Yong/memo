import { useAccessToken } from '../../../controllers/useAccessToken';
import { createController } from '../../../controllers/Controller';
import { CommonError } from '../../../models/Error';
import { WorkspaceSchema } from '@suyong/memo-core';
import { WorkspaceDAO } from '../models/Workspace.model';
import { UserDAO } from '@/domains/users/models/User.model';

export const addMemberToWorkspace = createController(async ({ context, useRepository, useResponse, useRequestBody, useParams }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(WorkspaceSchema.member);
  const workspaceRepository = useRepository(WorkspaceDAO);
  const userRepository = useRepository(UserDAO);
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
  if (originalMembers.some((it) => it.id === member.id)) throw CommonError.USER_ALREADY_EXIST(407, 'this member already exists');

  workspace.members = [...originalMembers, member];
  workspace.mark(user);

  const result = await workspaceRepository.save(workspace);

  useResponse(
    200,
    await WorkspaceDAO.toResponse(result, { withMembers: true }),
  );
});

export const removeMemberToWorkspace = createController(async ({ context, useRepository, useResponse, useRequestBody, useParams }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(WorkspaceSchema.member);
  const workspaceRepository = useRepository(WorkspaceDAO);
  const userRepository = useRepository(UserDAO);
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

  workspace.members = (await workspace.members ?? []).filter((m) => m.id !== body.memberId);
  workspace.mark(user);

  const result = await workspaceRepository.save(workspace);

  useResponse(
    200,
    await WorkspaceDAO.toResponse(result, { withMembers: true }),
  );
});
