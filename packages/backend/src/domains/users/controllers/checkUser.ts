import { createController } from '../../../controllers/Controller';
import { CommonError } from '../../../models/Error';
import { UserDAO } from '../models/User.model';

export const checkCanRegisterUser = createController(async ({ useRepository, useResponse, useParams }) => {
  const params = useParams();
  const repository = useRepository(UserDAO);

  const user = await repository.findOneBy({ email: params.email });
  if (user) throw CommonError.USER_ALREADY_EXIST();

  useResponse(204);
});
