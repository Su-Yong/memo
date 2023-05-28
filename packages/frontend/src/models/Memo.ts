import { Modifiable } from './Common';
import { Workspace } from './Workspace';

export interface Memo extends Modifiable {
  id: string;
  name: string;
  content: string;
  image?: string;

  workspace: Workspace;

  children?: Memo[];
}
