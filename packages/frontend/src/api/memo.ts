import axios from './config';
import { Memo } from '../models/Memo';

export interface FetchMemoOptions {
  as?: 'default' | 'tree';
}
export const fetchMemo = async (memoId: string, { as = 'default' }: FetchMemoOptions = {}): Promise<Memo> => {
  const response = await axios.get(`/memos/${memoId}?as=${as}`);

  console.log('fetchMemo', memoId);
  return response.data;
};

export const fetchMemoByWorkspace = async (workspaceId: number, { as = 'default' }: FetchMemoOptions = {}): Promise<Memo[]> => {
  const response = await axios.get(`/workspaces/${workspaceId}/memos?as=${as}`);

  return response.data;
};
