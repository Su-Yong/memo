import { cx } from '../utils/className';
import { fetchMemo } from '../api/memo';
import { useQuery } from '@tanstack/react-query';
import Spinner from './common/Spinner';
import React, { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { SELECTED_MEMO_ID, TAB_MEMO_ID_LIST } from '../store/memo';

export interface MemoTabItemProps {
  memoId: number;
  selected?: boolean;
}
const MemoTabItem = ({ memoId, selected }: MemoTabItemProps) => {
  const setSelectedMemoId = useSetAtom(SELECTED_MEMO_ID);
  const setTabMemoIdList = useSetAtom(TAB_MEMO_ID_LIST);

  const { data: memo } = useQuery(
    ['memo', memoId],
    async () => fetchMemo(memoId),
  );

  const onClick = useCallback(() => {
    if (memo) setSelectedMemoId(memo.id);
  }, [memo]);

  const onClose = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setTabMemoIdList((prev) => prev.filter((id) => id !== memoId));
  }, []);

  return (
    <div
      className={cx(
        `
          w-fit min-w-fit flex flex-row justify-between items-center gap-2
          pl-3 pr-1 py-1 bg-gray-50 rounded-md shadow-sm
          select-none cursor-pointer truncate
        `,
        selected && 'bg-primary-100 font-bold',
      )}
      onClick={onClick}
    >
      <span className={'shrink-1'}>
        {memo && memo.name}
        {!memo && <Spinner className={'w-4 h-4 stroke-gray-300'} />}
        {!memo && '로딩중...'}
      </span>
      <button className={'btn-text btn-icon p-1 flex shrink-0'} onClick={onClose}>
        <i className={'material-symbols-outlined icon text-sm'}>
          close
        </i>
      </button>
    </div>
  );
};

export default MemoTabItem;
