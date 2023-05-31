import { useAccessToken } from '../../../controllers/useAccessToken';
import { createController } from '../../../controllers/Controller';
import { CommonError } from '../../../models/Error';
import { IsNull } from 'typeorm';
import { MemoDAO } from '../models/Memo.model';
import { WorkspaceDAO } from '@/domains/workspaces/models/Workspace.model';

export const getMemo = createController(async ({ context, useRepository, useResponse, useParams, useQuery }) => {
  const token = useAccessToken(context);
  const params = useParams();
  const query = useQuery();
  const responseAs = query.as || 'tree';

  const repository = useRepository(MemoDAO, 'tree');

  const memo = await repository.findOne({
    where: { id: params.id },
    relations: ['workspace', 'workspace.members', 'workspace.owner'],
  });
  if (!memo) throw CommonError.MEMO_NOT_FOUND();
  if (!await memo.canRead(token)) throw CommonError.MEMO_NOT_ALLOWED_RESOURCE();

  if (responseAs === 'tree') {
    const tree = await repository.findDescendantsTree(memo);

    useResponse(
      200,
      await MemoDAO.toTreeResponse(tree, { withWorkspace: true, withAvailableActions: token }),
    );
  } else {
    useResponse(
      200,
      await MemoDAO.toResponse(memo, { withWorkspace: true, withAvailableActions: token }),
    );
  }
});

export const getMemos = createController(async ({ context, useRepository, useResponse, useParams, useQuery }) => {
  const token = useAccessToken(context);
  const params = useParams();
  const query = useQuery();
  const responseAs = query.as || 'default';

  const memoRepository = useRepository(MemoDAO, 'tree');
  const workspaceRepository = useRepository(WorkspaceDAO);

  const workspace = await workspaceRepository.findOne({
    where: { id: Number(params.workspaceId) },
    relations: ['members', 'owner'],
  });
  if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();

  const memos = await memoRepository.find({
    where: {
      workspace: { id: workspace.id },
      parent: IsNull(),
    },
    relations: ['workspace', 'workspace.members', 'workspace.owner'],
  });
  if (!memos) throw CommonError.MEMO_NOT_FOUND();
  if (!await workspace.canRead(token)) throw CommonError.MEMO_NOT_ALLOWED_RESOURCE();

  if (responseAs === 'tree') {
    const trees = await Promise.all(memos.map((memo) => memoRepository.findDescendantsTree(memo)));

    useResponse(
      200,
      await Promise.all(trees.map((tree) => MemoDAO.toTreeResponse(tree, { withWorkspace: true, withAvailableActions: token }))),
    );
  } else {
    useResponse(
      200,
      await Promise.all(memos.map((memo) => MemoDAO.toResponse(memo, { withWorkspace: true, withAvailableActions: token }))),
    );
  }
});
