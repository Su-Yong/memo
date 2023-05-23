import JWT from 'jsonwebtoken';
import { compare } from 'bcrypt';

import { createController } from '../../../controllers/Controller.js';
import UserSchema from '../models/User.schema.js';
import { User } from '../models/User.model.js';
import { CommonError } from '../../../models/Error.js';

export const loginUser = createController(async ({ useRequestBody, useRepository, useResponse, useConfig }) => {
  const body = useRequestBody(UserSchema.login);
  const repository = useRepository(User);
  const config = useConfig();

  const user = await repository.findOneBy({ email: body.email });
  console.log('user', user, CommonError.USER_INVALID_PASSWORD);
  if (!user) throw CommonError.USER_INVALID_PASSWORD();
  console.log('user end', user);

  const isPasswordMatch = await compare(body.password, user.password);
  console.log('before password', user);
  if (!isPasswordMatch) throw CommonError.USER_INVALID_PASSWORD();
  console.log('after password', user);
  
  const token = JWT.sign(UserSchema.toResponse(user), config.security.secret, { expiresIn: '1d' });
  console.log('jwt sign', user);

  useResponse(200, {
    accessToken: token,
    user: UserSchema.toResponse(user),
  });
});
