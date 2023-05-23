import { useAccessToken } from '../../../controllers/useAccessToken.js';
import { createController } from '../../../controllers/Controller.js';
import { User } from '../models/User.model.js';
import UserSchema from '../models/User.schema.js';

import createHttpError from 'http-errors';

export const getUser = createController(async ({ context, useRepository, useResponse, useParams }) => {
  const token = useAccessToken(context);
  const repository = useRepository(User);
  const params = useParams();

  const user = await repository.findOneBy({ email: params.email ?? token.email });
  if (!user) throw createHttpError(404, 'User not found');
  if (!await user.canRead(token)) throw createHttpError(401, 'You are not allowed to update this user');

  useResponse(200, UserSchema.toResponse(user));
});
