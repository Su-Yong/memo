import z from 'zod';
import { User } from './User.model.js';

class UserSchema {
  static create = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
  });

  static login = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  static response = z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string(),
    permission: z.enum(['admin', 'member', 'guest']),
  });

  static toResponse(user: User): z.infer<typeof this.response> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      permission: user.permission,
    };
  }
}

export default UserSchema;
