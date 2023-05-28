import { CommonError } from '../../../models/Error';
import { createController } from '../../../controllers/Controller';
import { User } from '../models/User.model';
import UserSchema from '../models/User.schema';

import { hash } from 'bcrypt';

export const createUser = createController(async ({ useRequestBody, useRepository, useResponse }) => {
  const body = useRequestBody(UserSchema.create);
  const repository = useRepository(User);

  const checkAlreadyExist = await repository.findOneBy({ email: body.email });
  if (checkAlreadyExist) throw CommonError.USER_ALREADY_EXIST();

  const user = new User();
  user.email = body.email;
  user.password = await hash(body.password, 12);
  user.name = body.name;
  user.permission = 'member';

  const result = await repository.save(user);

  useResponse(201, UserSchema.toResponse(result));
});
