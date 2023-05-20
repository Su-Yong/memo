import { createController } from '../../../controllers/Controller.js';
import { User } from '../models/User.model.js';
import { createUserSchema } from '../models/User.schema.js';

export const createUser = createController(async ({ useRequestBody, useRepository, useResponse }) => {
  const body = useRequestBody(createUserSchema);
  const repository = useRepository(User);

  const user = new User();
  user.email = body.email;
  user.password = body.password;
  user.name = body.name;
  user.role = 'user';

  const result = await repository.save(user);

  useResponse(201, result);
});
