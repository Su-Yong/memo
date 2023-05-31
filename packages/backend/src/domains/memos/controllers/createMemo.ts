import { useAccessToken } from '../../../controllers/useAccessToken';
import { createController } from '../../../controllers/Controller';
import { CommonError } from '../../../models/Error';
import * as Y from 'yjs';
import { MemoSchema } from '@suyong/memo-core';
import { UserDAO } from '@/domains/users/models/User.model';
import { WorkspaceDAO } from '@/domains/workspaces/models/Workspace.model';
import { MemoDAO } from '../models/Memo.model';

export const createMemo = createController(async ({ context, useRequestBody, useRepository, useResponse }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(MemoSchema.create);

  const userRepository = useRepository(UserDAO);
  const workspaceRepository = useRepository(WorkspaceDAO);
  const memoRepository = useRepository(MemoDAO, 'tree');

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const workspace = await workspaceRepository.findOneBy({ id: body.workspaceId });
  if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();

  const memo = new MemoDAO();

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
  memo.content = Buffer.from(rawDocData);
  memo.image = body.image;
  if (body.visibleRange) memo.visibleRange = body.visibleRange;
  if (body.editableRange) memo.editableRange = body.editableRange;
  memo.workspace = workspace;
  memo.children = [];
  memo.mark(user);

  const result = await memoRepository.save(memo);

  useResponse(
    201,
    await MemoDAO.toResponse(result, {
      withWorkspace: true,
      withAvailableActions: user,
    }),
  );
});
