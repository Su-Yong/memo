import createHttpError from 'http-errors';
import { createController } from '../../../controllers/Controller';
import { useAccessToken } from '../../../controllers/useAccessToken';
import { CommonError } from '../../../models/Error';
import { MemoDAO } from '../models/Memo.model';

export const deleteMemo = createController(async ({ context, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const memoRepository = useRepository(MemoDAO);
  const params = useParams();

  const memo = await memoRepository.findOne({
    where: {
      id: params.id
    },
    relations: ['workspace', 'workspace.members'],
  });

  if (!memo) throw CommonError.WORKSPACE_NOT_FOUND();
  if (!(await memo.canDelete(token))) throw CommonError.MEMO_NOT_ALLOWED_RESOURCE(403, 'You cannot delete this memo');

  await memoRepository.delete(memo.id);

  useResponse(204);
});
