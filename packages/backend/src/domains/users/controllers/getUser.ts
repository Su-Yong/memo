import { useAccessToken } from '../../../controllers/useAccessToken';
import { createController } from '../../../controllers/Controller';
import { User } from '../models/User.model';
import UserSchema from '../models/User.schema';
import { CommonError } from '../../../models/Error';

export const getUser = createController(async ({ context, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const repository = useRepository(User);
  const params = useParams();

  const user = await repository.findOneBy({ email: params.email ?? token.email });
  if (!user) throw CommonError.USER_NOT_FOUND();
  if (!await user.canRead(token)) throw CommonError.AUTH_NOT_ALLOWED_RESOURCE(401, 'You are not allowed to update this user');

  useResponse(200, UserSchema.toResponse(user));
});
