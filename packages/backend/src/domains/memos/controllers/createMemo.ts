import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { createController } from '../../../controllers/Controller.js';
import { Workspace } from '../../workspaces/models/Workspace.model.js';
import { Memo } from '../models/Memo.model.js';
import MemoSchema from '../models/Memo.schema.js';
import { CommonError } from '../../../models/Error.js';
import { User } from '../../users/models/User.model.js';

export const createMemo = createController(async ({ context, useRequestBody, useRepository, useResponse }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(MemoSchema.create);

  const userRepository = useRepository(User);
  const workspaceRepository = useRepository(Workspace);
  const memoRepository = useRepository(Memo, 'tree');

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const workspace = await workspaceRepository.findOneBy({ id: body.workspaceId });
  if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();

  const memo = new Memo();

  if (body.parentId) {
    const parentMemo = await memoRepository.findOneBy({ id: body.parentId });
    if (!parentMemo) throw CommonError.MEMO_NOT_FOUND();

    memo.parent = parentMemo;
    parentMemo.children ??= [];
    parentMemo.children.push(memo);
  }

  memo.name = body.name;
  memo.content = body.content;
  memo.image = body.image;
  if (body.visibleRange) memo.visibleRange = body.visibleRange;
  if (body.editableRange) memo.editableRange = body.editableRange;
  memo.workspace = workspace;
  memo.children = [];
  memo.mark(user);

  const result = await memoRepository.save(memo);

  useResponse(
    201,
    await MemoSchema.toResponse(result, {
      withWorkspace: true,
      withAvailableActions: user,
    }),
  );
});
