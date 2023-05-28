import { SetStateAction, atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const SELECTED_MEMO_ID = atomWithStorage<string | null>('selected-memo-id', null);

const STORAGE_TAB_MEMO_ID_LIST = atomWithStorage<string[]>('opened-tab', []);
export const TAB_MEMO_ID_LIST = atom(
  (get) => get(STORAGE_TAB_MEMO_ID_LIST),
  (get, set, list: SetStateAction<string[]>) => {
    if (typeof list === 'function') list = list(get(STORAGE_TAB_MEMO_ID_LIST));

    const nowSelectId = get(SELECTED_MEMO_ID);
    if (list.length === 0) set(SELECTED_MEMO_ID, null);
    else if (typeof nowSelectId === 'string' && !list.includes(nowSelectId)) set(SELECTED_MEMO_ID, list[list.length - 1]);

    set(STORAGE_TAB_MEMO_ID_LIST, list);
  }
)
export const TREE_OPEN_MEMO_ID_LIST = atomWithStorage<string[]>('opened-tree', []);
