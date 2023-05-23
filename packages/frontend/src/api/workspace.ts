import { Workspace } from '../models/Workspace.js';
import axios from './config.js';

export interface FetchWorkspace {
  (id?: 'my'): Promise<Workspace[]>;
  (id: number): Promise<Workspace>;
}
export const fetchWorkspace: FetchWorkspace = async (params = 'my') => {
  const response = await axios.get(`/workspaces/${params}`);

  return response.data;
};
