import { MemoRequest, MemoResponse, MemoUpdate } from '@suyong/memo-core';
import axios from './config';

export interface FetchMemoOptions {
  as?: 'default' | 'tree';
}
export const fetchMemo = async (memoId: string, { as = 'default' }: FetchMemoOptions = {}): Promise<MemoResponse> => {
  const response = await axios.get(`/memos/${memoId}?as=${as}`);

  return response.data;
};

export const fetchMemoByWorkspace = async (workspaceId: number, { as = 'default' }: FetchMemoOptions = {}): Promise<MemoResponse[]> => {
  const response = await axios.get(`/workspaces/${workspaceId}/memos?as=${as}`);

  return response.data;
};

export const updateMemo = async (memoId: string, memo: MemoUpdate): Promise<MemoResponse> => {
  const response = await axios.patch(`/memos/${memoId}`, memo);

  return response.data;
};

export const createMemo = async (memo: MemoRequest): Promise<MemoResponse> => {
  const response = await axios.post(`/memos`, memo);

  return response.data;
};
