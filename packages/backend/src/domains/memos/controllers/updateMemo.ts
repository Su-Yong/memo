import { useAccessToken } from '../../../controllers/useAccessToken';
import { createController } from '../../../controllers/Controller';
import { Memo } from '../models/Memo.model';
import MemoSchema from '../models/Memo.schema';
import { CommonError } from '../../../models/Error';
import { User } from '../../users/models/User.model';

export const updateMemo = createController(async ({ context, useRequestBody, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(MemoSchema.update);
  const params = useParams();

  const userRepository = useRepository(User);
  const memoRepository = useRepository(Memo, 'tree');

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
    await MemoSchema.toResponse(result, {
      withWorkspace: false,
      withAvailableActions: user,
    }),
  );
});
