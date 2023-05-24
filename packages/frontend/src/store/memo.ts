import { atomWithStorage } from 'jotai/utils';

export const SELECTED_MEMO_ID = atomWithStorage<number | null>('selected-memo-id', null);
export const TAB_MEMO_ID_LIST = atomWithStorage<number[]>('opened-tab', []);
export const TREE_OPEN_MEMO_ID_LIST = atomWithStorage<number[]>('opened-tree', []);
