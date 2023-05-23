import { Modifiable } from './Common';
import { User } from './User';

export interface Workspace extends Modifiable {
  id: number;
  name: string;
  description?: string;
  image?: string;
  members: User[];
  owner: User;
}
