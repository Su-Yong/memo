import z from 'zod';
import { IUser } from './User.model.js';

class UserSchema {
  static create = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
    profile: z.string().optional(),
  });

  static update = z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().optional(),
    profile: z.string().optional(),
  });

  static login = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  static response = z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string(),
    profile: z.string().optional(),
    permission: z.enum(['admin', 'member', 'guest']),
  });

  static toResponse(user: IUser): z.infer<typeof this.response> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profile: user.profile,
      permission: user.permission,
    };
  }
}

export default UserSchema;
