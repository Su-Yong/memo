import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { createController } from '../../../controllers/Controller.js';
import { Memo } from '../models/Memo.model.js';
import { CommonError } from '../../../models/Error.js';
import MemoSchema from '../models/Memo.schema.js';
import { Workspace } from '../../workspaces/models/Workspace.model.js';

export const getMemo = createController(async ({ context, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const params = useParams();

  const repository = useRepository(Memo);

  const memo = await repository.findOne({
    where: { id: Number(params.id) },
    relations: ['workspace', 'workspace.members', 'workspace.owner'],
  });

  if (!memo) throw CommonError.MEMO_NOT_FOUND();
  if (!await memo.canRead(token)) throw CommonError.MEMO_NOT_ALLOWED_RESOURCE();

  useResponse(
    200,
    await MemoSchema.toResponse(memo, { withWorkspace: true, withAvailableActions: token }),
  );
});

export const getMemos = createController(async ({ context, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const params = useParams();

  const memoRepository = useRepository(Memo);
  const workspaceRepository = useRepository(Workspace);

  const workspace = await workspaceRepository.findOne({
    where: { id: Number(params.workspaceId) },
    relations: ['members', 'owner'],
  });
  if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();

  const memos = await memoRepository.find({
    where: { workspace: { id: workspace.id } },
    relations: ['workspace', 'workspace.members', 'workspace.owner'],
  });

  if (!memos) throw CommonError.MEMO_NOT_FOUND();
  if (!await workspace.canRead(token)) throw CommonError.MEMO_NOT_ALLOWED_RESOURCE();

  useResponse(
    200,
    await Promise.all(memos.map((memo) => MemoSchema.toResponse(memo, { withWorkspace: true, withAvailableActions: token }))),
  );
});
