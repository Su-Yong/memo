import { createController } from '../../../controllers/Controller';
import { User } from '../models/User.model';
import { useAccessToken } from '../../../controllers/useAccessToken';
import JWT from 'jsonwebtoken';
import UserSchema from '../models/User.schema';
import { CommonError } from '../../../models/Error';

export const refreshUser = createController(async ({ useRepository, useResponse, useConfig, context }) => {
  const user = useAccessToken(context);
  const config = useConfig();
  const repository = useRepository(User);

  const newUser = await repository.findOneBy({ id: user.id });
  if (!newUser) throw CommonError.USER_NOT_FOUND();

  const token = JWT.sign(UserSchema.toResponse(newUser), config.security.secret, { expiresIn: '1d' });

  useResponse(200, {
    accessToken: token,
  });
});
