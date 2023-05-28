import { useAccessToken } from '../../../controllers/useAccessToken';
import { createController } from '../../../controllers/Controller';
import { Memo } from '../models/Memo.model';
import { CommonError } from '../../../models/Error';
import MemoSchema from '../models/Memo.schema';
import { Workspace } from '../../workspaces/models/Workspace.model';
import { IsNull } from 'typeorm';

export const getMemo = createController(async ({ context, useRepository, useResponse, useParams, useQuery }) => {
  const token = useAccessToken(context);
  const params = useParams();
  const query = useQuery();
  const responseAs = query.as || 'tree';

  const repository = useRepository(Memo, 'tree');

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
      await MemoSchema.toTreeResponse(tree, { withWorkspace: true, withAvailableActions: token }),
    );
  } else {
    useResponse(
      200,
      await MemoSchema.toResponse(memo, { withWorkspace: true, withAvailableActions: token }),
    );
  }
});

export const getMemos = createController(async ({ context, useRepository, useResponse, useParams, useQuery }) => {
  const token = useAccessToken(context);
  const params = useParams();
  const query = useQuery();
  const responseAs = query.as || 'default';

  const memoRepository = useRepository(Memo, 'tree');
  const workspaceRepository = useRepository(Workspace);

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
      await Promise.all(trees.map((tree) => MemoSchema.toTreeResponse(tree, { withWorkspace: true, withAvailableActions: token }))),
    );
  } else {
    useResponse(
      200,
      await Promise.all(memos.map((memo) => MemoSchema.toResponse(memo, { withWorkspace: true, withAvailableActions: token }))),
    );
  }
});
