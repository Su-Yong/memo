import { createController } from '../../../controllers/Controller.js';
import { User } from '../models/User.model.js';
import { useAccessToken } from '../../../controllers/useAccessToken.js';
import createHttpError from 'http-errors';
import JWT from 'jsonwebtoken';
import UserSchema from '../models/User.schema.js';

export const refreshUser = createController(async ({ useRepository, useResponse, useConfig, context }) => {
  const user = useAccessToken(context);
  const config = useConfig();
  const repository = useRepository(User);

  const newUser = await repository.findOneBy({ id: user.id });
  if (!newUser) throw createHttpError(404, 'User not found');

  const token = JWT.sign(UserSchema.toResponse(newUser), config.security.secret, { expiresIn: '1d' });

  useResponse(200, {
    accessToken: token,
  });
});
