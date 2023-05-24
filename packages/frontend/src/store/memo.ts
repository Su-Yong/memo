import { atomWithStorage } from 'jotai/utils';

export const TAB_MEMO_ID_LIST = atomWithStorage<string[]>('open-tab', []);
