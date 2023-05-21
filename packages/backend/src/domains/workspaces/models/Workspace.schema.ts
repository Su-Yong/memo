import z from 'zod';
import { Workspace } from './Workspace.model.js';
import UserSchema from '../../users/models/User.schema.js';

class WorkspaceSchema {
  static create = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
  });

  static response = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    members: UserSchema.response.array().optional(),
    owner: UserSchema.response.optional(),
  });

  static async toResponse(workspace: Workspace, withMembers = false): Promise<z.infer<typeof this.response>> {
    const result: z.infer<typeof this.response> = {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
    };

    if (withMembers) {
      const members = await workspace.members;
      const owner = await workspace.owner;
      if (members) result.members = members.map((user) => UserSchema.toResponse(user)) ?? [];
      if (owner) result.owner = UserSchema.toResponse(owner);
    }

    return result;
  }
}

export default WorkspaceSchema;
