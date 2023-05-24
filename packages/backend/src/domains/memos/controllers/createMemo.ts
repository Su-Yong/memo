import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { createController } from '../../../controllers/Controller.js';
import { Workspace } from '../../workspaces/models/Workspace.model.js';
import { Memo } from '../models/Memo.model.js';
import MemoSchema from '../models/Memo.schema.js';
import { CommonError } from '../../../models/Error.js';
import { User } from '../../users/models/User.model.js';

export const createMemo = createController(async ({ context, useRequestBody, useParams, useRepository, useResponse }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(MemoSchema.create);
  const params = useParams();

  const userRepository = useRepository(User);
  const workspaceRepository = useRepository(Workspace);
  const memoRepository = useRepository(Memo);

  const workspaceId = Number(params.workspaceId);

  const user = await userRepository.findOneBy({ id: token.id });
  if (!user) throw CommonError.USER_NOT_FOUND();

  const workspace = await workspaceRepository.findOneBy({ id: workspaceId });
  if (!workspace) throw CommonError.WORKSPACE_NOT_FOUND();

  const memo = new Memo();
  memo.name = body.name;
  memo.content = body.content;
  memo.image = body.image;
  if (body.visibleRange) memo.visibleRange = body.visibleRange;
  if (body.editableRange) memo.editableRange = body.editableRange;
  memo.workspace = workspace;
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
