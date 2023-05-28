import JWT from 'jsonwebtoken';
import { compare } from 'bcrypt';

import { createController } from '../../../controllers/Controller';
import UserSchema from '../models/User.schema';
import { User } from '../models/User.model';
import { CommonError } from '../../../models/Error';

export const loginUser = createController(async ({ useRequestBody, useRepository, useResponse, useConfig }) => {
  const body = useRequestBody(UserSchema.login);
  const repository = useRepository(User);
  const config = useConfig();

  const user = await repository.findOneBy({ email: body.email });
  if (!user) throw CommonError.USER_INVALID_PASSWORD();

  const isPasswordMatch = await compare(body.password, user.password);
  if (!isPasswordMatch) throw CommonError.USER_INVALID_PASSWORD();

  const token = JWT.sign(UserSchema.toResponse(user), config.security.secret, { expiresIn: '1d' });

  useResponse(200, {
    accessToken: token,
    user: UserSchema.toResponse(user),
  });
});
