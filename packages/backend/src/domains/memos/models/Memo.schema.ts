import z from 'zod';
import { Memo } from './Memo.model.js';
import UserSchema from '../../users/models/User.schema.js';
import { ModifiableSchema } from '../../../models/Common.js';
import WorkspaceSchema, { ToWorkspaceResponseOptions } from '../../workspaces/models/Workspace.schema.js';

export const MemoActionsSchema = z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'VISIBLE', 'EDITABLE']).array();

export interface ToMemoResponseOptions {
  withWorkspace?: boolean | ToWorkspaceResponseOptions;
  withAvailableActions?: z.infer<typeof UserSchema.response>;
}
class MemoSchema extends ModifiableSchema {
  static create = z.object({
    name: z.string().min(1),
    content: z.string(),
    image: z.string().optional(),
    visibleRange: z.enum(['public', 'link', 'member']).optional(),
    editableRange: z.enum(['public', 'link', 'member', 'owner']).optional(),
  });

  static update = z.object({
    name: z.string().min(12).optional(),
    content: z.string().optional(),
    image: z.string().optional(),
    visibleRange: z.enum(['public', 'link', 'member']).optional(),
    editableRange: z.enum(['public', 'link', 'member', 'owner']).optional(),
  });

  static override response = ModifiableSchema.response.extend({
    id: z.number(),
    name: z.string(),
    content: z.string().optional(),
    image: z.string().optional(),
    workspace: WorkspaceSchema.response.optional(),
    availableActions: MemoActionsSchema.optional(),
  });

  static override async toResponse(
    memo: Memo,
    {
      withWorkspace = false,
      withAvailableActions = undefined,
    }: ToMemoResponseOptions = {},
  ): Promise<z.infer<typeof this.response>> {
    const result: z.infer<typeof this.response> = {
      id: memo.id,
      name: memo.name,
      content: memo.content,
      image: memo.image,
      ...await super.toResponse(memo),
    };

    if (withWorkspace) {
      let options = {};
      if (typeof withWorkspace !== 'boolean') options = withWorkspace;

      result.workspace = await WorkspaceSchema.toResponse(await memo.workspace, options);
    }
    // if (withAvailableActions) result.availableActions = await memo.getAvailableActions(withAvailableActions);

    return result;
  }
}

export default MemoSchema;
