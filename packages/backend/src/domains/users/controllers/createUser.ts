import { createController } from '../../../controllers/Controller.js';
import { User } from '../models/User.model.js';
import UserSchema from '../models/User.schema.js';

import { hash } from 'bcrypt';
import HttpError from 'http-errors';

export const createUser = createController(async ({ useRequestBody, useRepository, useResponse, useConfig }) => {
  const body = useRequestBody(UserSchema.create);
  const repository = useRepository(User);

  const checkAlreadyExist = await repository.findOneBy({ email: body.email });
  if (checkAlreadyExist) throw HttpError(409, 'Email is already registered');

  const user = new User();
  user.email = body.email;
  user.password = await hash(body.password, 16);
  user.name = body.name;
  user.permission = 'member';

  const result = await repository.save(user);

  useResponse(201, UserSchema.toResponse(result));
});
