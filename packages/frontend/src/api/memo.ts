import axios from './config';
import { Memo } from '../models/Memo';

interface FetchMemo {
  (workspaceId: number): Promise<Memo[]>;
  (workspaceId: number, memoId: number): Promise<Memo>;
}
export const fetchMemo: FetchMemo = async (workspaceId, memoId?) => {
  if (typeof memoId === 'number') {
    const response = await axios.get(`/workspaces/${workspaceId}/memos/${memoId}`);

    return response.data;
  }

  const response = await axios.get(`/workspaces/${workspaceId}/memos`);

  return response.data;
};
