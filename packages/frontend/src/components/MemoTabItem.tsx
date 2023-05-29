import { cx } from '../utils/className';
import { fetchMemo } from '../api/memo';
import { useQuery } from '@tanstack/react-query';
import Spinner from './common/Spinner';
import React, { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { SELECTED_MEMO_ID, TAB_MEMO_ID_LIST } from '../store/memo';

export interface MemoTabItemProps {
  memoId: string;
  selected?: boolean;
}
const MemoTabItem = ({ memoId, selected }: MemoTabItemProps) => {
  const setSelectedMemoId = useSetAtom(SELECTED_MEMO_ID);
  const setTabMemoIdList = useSetAtom(TAB_MEMO_ID_LIST);

  const { data: memo, isLoading, error } = useQuery(
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
          pl-3 pr-1 py-1 bg-gray-50 rounded-md shadow-sm dark:bg-gray-950
          select-none cursor-pointer truncate
        `,
        !selected && 'text-gray-900 dark:text-gray-100',
        selected && 'bg-primary-100 text-primary-500 font-bold dark:bg-primary-900',
      )}
      onClick={onClick}
    >
      <span className={'shrink-1 flex justify-start items-center gap-2'}>
        {memo && memo.name}
        {isLoading && <Spinner className={'w-4 h-4 stroke-gray-300 dark:stroke-700'} />}
        {isLoading && '로딩중...'}
        {!memo && !!error && '오류 발생'}
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
