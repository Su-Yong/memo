import { atomWithStorage } from 'jotai/utils';

export const TAB_MEMO_ID_LIST = atomWithStorage<string[]>('opened-tab', []);
export const TREE_OPEN_MEMO_ID_LIST = atomWithStorage<number[]>('opened-tree', []);