import { CommonError } from '../../../models/Error';
import { createController } from '../../../controllers/Controller';
import { UserDAO } from '../models/User.model';

import { hash } from 'bcrypt';
import { UserSchema } from '@suyong/memo-core';

export const createUser = createController(async ({ useRequestBody, useRepository, useResponse }) => {
  const body = useRequestBody(UserSchema.create);
  const repository = useRepository(UserDAO);

  const checkAlreadyExist = await repository.findOneBy({ email: body.email });
  if (checkAlreadyExist) throw CommonError.USER_ALREADY_EXIST();

  const user = new UserDAO();
  user.email = body.email;
  user.password = await hash(body.password, 12);
  user.name = body.name;
  user.permission = 'member';

  const result = await repository.save(user);

  useResponse(201, UserDAO.toResponse(result));
});
