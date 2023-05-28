import { useAccessToken } from '../../../controllers/useAccessToken';
import { createController } from '../../../controllers/Controller';
import { Workspace } from '../../workspaces/models/Workspace.model';
import { Memo } from '../models/Memo.model';
import MemoSchema from '../models/Memo.schema';
import { CommonError } from '../../../models/Error';
import { User } from '../../users/models/User.model';
import * as Y from 'yjs';

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

  const doc = new Y.Doc();
  const rawDocData = Y.encodeStateAsUpdate(doc);
  memo.name = body.name;
  memo.content = Buffer.from(rawDocData).toString('base64');
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
