import z from 'zod';
import { Memo } from './Memo.model';
import UserSchema from '../../users/models/User.schema';
import { ModifiableSchema } from '../../../models/Common';
import WorkspaceSchema, { ToWorkspaceResponseOptions } from '../../workspaces/models/Workspace.schema';

export const MemoActionsSchema = z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'VISIBLE', 'EDITABLE']).array();

export interface ToMemoResponseOptions {
  withWorkspace?: boolean | ToWorkspaceResponseOptions;
  withAvailableActions?: z.infer<typeof UserSchema.response>;
}
type MemoTreeResponseType = z.infer<typeof MemoSchema.response> & {
  children?: MemoTreeResponseType[];
  parent?: MemoTreeResponseType;
};
class MemoSchema extends ModifiableSchema {
  static create = z.object({
    workspaceId: z.number(),
    parentId: z.string().optional(),

    name: z.string().min(1),
    image: z.string().optional(),
    visibleRange: z.enum(['public', 'link', 'member']).optional(),
    editableRange: z.enum(['public', 'link', 'member', 'owner']).optional(),
  });

  static update = z.object({
    name: z.string().min(1).optional(),
    image: z.string().optional(),
    visibleRange: z.enum(['public', 'link', 'member']).optional(),
    editableRange: z.enum(['public', 'link', 'member', 'owner']).optional(),
  });

  static override response = ModifiableSchema.response.extend({
    id: z.string(),
    name: z.string(),
    content: z.string().optional(),
    image: z.string().optional(),
    workspace: WorkspaceSchema.response.optional(),
    availableActions: MemoActionsSchema.optional(),
  });

  static treeResponse: z.ZodType<MemoTreeResponseType> = MemoSchema.response.extend({
    children: z.lazy(() => MemoSchema.treeResponse.array()).optional(),
    parent: z.lazy(() => MemoSchema.treeResponse).optional(),
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

  static async toTreeResponse(
    memo: Memo,
    {
      withWorkspace = false,
      withAvailableActions = undefined,
    }: ToMemoResponseOptions = {},
  ): Promise<z.infer<typeof this.treeResponse>> {
    const result: z.infer<typeof this.treeResponse> = await this.toResponse(memo, { withWorkspace, withAvailableActions });

    if (memo.parent) result.parent = await MemoSchema.toTreeResponse(memo.parent);
    if (memo.children) result.children = await Promise.all(memo.children.map((child) => MemoSchema.toTreeResponse(child)));

    return result;
  }
}

export default MemoSchema;
