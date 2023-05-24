import axios from './config';
import { Memo } from '../models/Memo';

export interface FetchMemoOptions {
  as?: 'default' | 'tree';
}
interface FetchMemo {
  (workspaceId: number, options?: FetchMemoOptions): Promise<Memo[]>;
  (workspaceId: number, memoId: number, options?: FetchMemoOptions): Promise<Memo>;
}
export const fetchMemo: FetchMemo = async (workspaceId, param1?, param2: FetchMemoOptions = {}) => {
  const url = `/workspaces/${workspaceId}/memos/${typeof param1 === 'number' ? param1 : ''}`;
  const mode = typeof param1 === 'number' ? param2.as : param1?.as;

  const response = await axios.get(`${url}?as=${mode ?? 'default'}`);

  return response.data;
};
