import { User } from '@suyong/memo-core';
import { Token as BaseToken } from '@suyong/memo-core';
import { UserDAO } from './User.model';

export class Token {
  static toResponse(user: User, type: BaseToken['type'] = 'accessToken'): Omit<BaseToken, 'iat' | 'exp'> {
    const responseUser = UserDAO.toResponse(user);

    return {
      ...responseUser,
      type,
    };
  }
}