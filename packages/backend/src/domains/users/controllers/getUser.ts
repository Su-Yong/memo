import { useAccessToken } from '../../../controllers/useAccessToken';
import { createController } from '../../../controllers/Controller';
import { CommonError } from '../../../models/Error';
import { UserDAO } from '../models/User.model';

export const getUser = createController(async ({ context, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const repository = useRepository(UserDAO);
  const params = useParams();

  const user = await repository.findOneBy({ email: params.email ?? token.email });
  if (!user) throw CommonError.USER_NOT_FOUND();
  if (!await user.canRead(token)) throw CommonError.AUTH_NOT_ALLOWED_RESOURCE(401, 'You are not allowed to update this user');

  useResponse(200, UserDAO.toResponse(user));
});
