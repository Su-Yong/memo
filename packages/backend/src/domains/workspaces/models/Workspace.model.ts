import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { registerModel } from '@/models/model';
import { ModifiableDAO } from '@/models/Common';
import { WorkspaceActions, User, Workspace, Memo } from '@suyong/memo-core';
import { UserDAO } from '@/domains/users/models/User.model';
import { WorkspaceResponse } from '@suyong/memo-core';

export type ToWorkspaceResponseOptions<Target extends Workspace | WorkspaceDAO> = {
  withMembers?: boolean;
} & (
  Target extends WorkspaceDAO
    ? { withAvailableActions?: User; }
    : { withAvailableActions?: undefined; }
)

@registerModel
@Entity({ name: 'workspace' })
export class WorkspaceDAO extends ModifiableDAO implements Workspace {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({
    type: 'enum',
    enum: ['public', 'link', 'member'],
    default: 'member'
  })
  visibleRange!: 'public' | 'link' | 'member';

  @Column({
    type: 'enum',
    enum: ['public', 'link', 'member', 'owner'],
    default: 'member'
  })
  editableRange!: 'public' | 'link' | 'member' | 'owner';

  @ManyToMany(() => UserDAO, user => user.workspaces)
  @JoinTable({ name: 'workspace_members_user' })
  members?: Promise<UserDAO[]> | UserDAO[];

  @ManyToOne(() => UserDAO)
  @JoinColumn()
  owner!: Promise<UserDAO> | UserDAO;

  @OneToMany('MemoDAO', (memo: Memo) => memo.workspace)
  @JoinColumn()
  memos!: Promise<Memo[]> | Memo[];

  // permissions
  async canRead(user: User): Promise<boolean> {
    const isMember = !!(await this.members)?.find((member) => member.id === user.id);
    const isOwner = (await this.owner)?.id === user.id;

    return isMember || isOwner;
  }

  async canUpdate(user: User): Promise<boolean> {
    const isOwner = (await this.owner)?.id === user.id;

    return isOwner || user.permission === 'admin';
  }

  canDelete = this.canUpdate;

  async canVisible(user: User): Promise<boolean> {
    if (this.visibleRange === 'public') return true;
    if (this.visibleRange === 'link') return true;

    const isMember = !!(await this.members)?.find((member) => member.id === user.id);
    const isOwner = (await this.owner)?.id === user.id;

    return  isMember || isOwner;
  }

  async canEditable(user: User): Promise<boolean> {
    if (this.editableRange === 'public') return true;
    if (this.editableRange === 'link') return true;

    const isMember = !!(await this.members)?.find((member) => member.id === user.id);
    const isOwner = (await this.owner)?.id === user.id;

    if (this.editableRange === 'member') return isMember || isOwner;
    return isOwner;
  }

  async getAvailableActions(user: User): Promise<WorkspaceActions> {
    const result: WorkspaceActions = ['CREATE'];

    const [
      read,
      update,
      deleteAction,
      visible,
      editable,
    ] = await Promise.all([
      this.canRead(user),
      this.canUpdate(user),
      this.canDelete(user),
      this.canVisible(user),
      this.canEditable(user),
    ]);

    if (read) result.push('READ');
    if (update) result.push('UPDATE');
    if (deleteAction) result.push('DELETE');
    if (visible) result.push('VISIBLE');
    if (editable) result.push('EDITABLE');

    return result;
  }

  // utils
  static override async toResponse<Target extends Workspace | WorkspaceDAO>(
    workspace: Target,
    {
      withMembers = true,
      withAvailableActions = undefined,
    }: ToWorkspaceResponseOptions<Target> = {},
  ): Promise<WorkspaceResponse> {
    const result: WorkspaceResponse = {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      image: workspace.image,
      ...await super.toResponse(workspace),
    };

    if (withMembers) {
      const members = await workspace.members;
      const owner = await workspace.owner;
      if (members) result.members = members.map((user) => UserDAO.toResponse(user)) ?? [];
      if (owner) result.owner = UserDAO.toResponse(owner);
    }
    if (withAvailableActions) {
      result.availableActions = await (workspace as WorkspaceDAO).getAvailableActions(withAvailableActions);
    }

    return result;
  }
}
