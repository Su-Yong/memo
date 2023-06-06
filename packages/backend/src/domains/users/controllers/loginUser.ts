import JWT from 'jsonwebtoken';
import { compare } from 'bcrypt';

import { createController } from '../../../controllers/Controller';
import { CommonError } from '../../../models/Error';
import { UserDAO } from '../models/User.model';
import { UserSchema } from '@suyong/memo-core';
import { Token } from '../models/Token';

export const loginUser = createController(async ({ useRequestBody, useRepository, useResponse, useConfig }) => {
  const body = useRequestBody(UserSchema.login);
  const repository = useRepository(UserDAO);
  const config = useConfig();

  const user = await repository.findOneBy({ email: body.email });
  if (!user) throw CommonError.USER_INVALID_PASSWORD();

  const isPasswordMatch = await compare(body.password, user.password);
  if (!isPasswordMatch) throw CommonError.USER_INVALID_PASSWORD();

  const accessToken = JWT.sign(Token.toResponse(user, 'accessToken'), config.security.secret, { expiresIn: '1h' });
  const refreshToken = JWT.sign(Token.toResponse(user, 'refreshToken'), config.security.secret, { expiresIn: '7d' });

  useResponse(200, {
    accessToken,
    refreshToken,
    user: UserDAO.toResponse(user),
  });
});
