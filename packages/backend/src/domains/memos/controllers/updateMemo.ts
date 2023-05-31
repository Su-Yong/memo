import { useAccessToken } from '../../../controllers/useAccessToken';
import { createController } from '../../../controllers/Controller';
import { CommonError } from '../../../models/Error';
import { MemoDAO } from '../models/Memo.model';
import { UserDAO } from '@/domains/users/models/User.model';
import { MemoSchema } from '@suyong/memo-core';

export const updateMemo = createController(async ({ context, useRequestBody, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(MemoSchema.update);
  const params = useParams();

  const userRepository = useRepository(UserDAO);
  const memoRepository = useRepository(MemoDAO, 'tree');

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const memo = await memoRepository.findOneBy({ id: params.id });
  if (!memo) throw CommonError.MEMO_NOT_FOUND();

  if (body.name) memo.name = body.name;
  memo.image = body.image;
  if (body.visibleRange) memo.visibleRange = body.visibleRange;
  if (body.editableRange) memo.editableRange = body.editableRange;
  memo.mark(user);

  const result = await memoRepository.save(memo);

  useResponse(
    200,
    await MemoDAO.toResponse(result, {
      withWorkspace: false,
      withAvailableActions: user,
    }),
  );
});
