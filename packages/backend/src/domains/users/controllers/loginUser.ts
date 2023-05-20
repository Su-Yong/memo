import JWT from 'jsonwebtoken';
import { compare } from 'bcrypt';
import HttpError from 'http-errors';

import { createController } from '../../../controllers/Controller.js';
import UserSchema from '../models/User.schema.js';
import { User } from '../models/User.model.js';

export const loginUser = createController(async ({ useRequestBody, useRepository, useResponse, useConfig }) => {
  const body = useRequestBody(UserSchema.login);
  const repository = useRepository(User);
  const config = useConfig();

  const user = await repository.findOneBy({ email: body.email });
  if (!user) throw HttpError(404, 'User not found');

  const isPasswordMatch = await compare(body.password, user.password);
  if (!isPasswordMatch) throw HttpError(401, 'Password is not match');

  const token = JWT.sign(UserSchema.toResponse(user), config.security.secret, { expiresIn: '1d' });

  useResponse(200, {
    accessToken: token,
  });
});
