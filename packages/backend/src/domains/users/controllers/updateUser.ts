import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { createController } from '../../../controllers/Controller.js';
import { User } from '../models/User.model.js';
import UserSchema from '../models/User.schema.js';

import { hash } from 'bcrypt';
import { CommonError } from '../../../models/Error.js';

export const updateUser = createController(async ({ context, useRequestBody, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const body = useRequestBody(UserSchema.update);
  const repository = useRepository(User);
  const params = useParams();

  const user = await repository.findOneBy({ email: params.email ?? token.email });
  if (!user) throw CommonError.USER_NOT_FOUND();
  if (!await user.canUpdate(token)) throw CommonError.USER_NOT_ALLOWED_RESOURCE();

  if (body.email) user.email = body.email;
  if (body.password) user.password = await hash(body.password, 12);
  if (body.name) user.name = body.name;
  if (body.profile) user.profile = body.profile;
  // if (user.permission === 'admin' && body.permission) user.permission = body.permission;

  const result = await repository.save(user);

  useResponse(200, UserSchema.toResponse(result));
});
