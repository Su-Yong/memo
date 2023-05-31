import { createController } from '../../../controllers/Controller';
import { useAccessToken } from '../../../controllers/useAccessToken';
import JWT from 'jsonwebtoken';
import { CommonError } from '../../../models/Error';
import { UserDAO } from '../models/User.model';

export const refreshUser = createController(async ({ useRepository, useResponse, useConfig, context }) => {
  const user = useAccessToken(context);
  const config = useConfig();
  const repository = useRepository(UserDAO);

  const newUser = await repository.findOneBy({ id: user.id });
  if (!newUser) throw CommonError.USER_NOT_FOUND();

  const token = JWT.sign(UserDAO.toResponse(newUser), config.security.secret, { expiresIn: '1d' });

  useResponse(200, {
    accessToken: token,
  });
});
