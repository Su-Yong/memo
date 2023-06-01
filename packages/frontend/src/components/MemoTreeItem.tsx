import React, { useCallback } from 'react';
import { cx } from '../utils/className';
import { MemoTreeResponse as Memo } from '@suyong/memo-core';
import DropDown, { DropDownItem } from './common/DropDown';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMemo } from '../api/memo';

const TREE_MENU_LIST = [
  {
    id: 'delete',
    name: '삭제',
    icon: 'delete',
    color: 'red',
  },
];

export interface MemoTreeItemProps {
  memo: Memo;
  selectedId?: string;
  depth?: number;
  open?: boolean;
  onCollapse?: (memo: Memo) => void;
  onClick?: (memo: Memo) => void;
}
const MemoTreeItem = ({
  memo,
  selectedId,
  depth = 0,
  open,
  onClick,
  onCollapse,
}: MemoTreeItemProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(async (id: string) => {
    await deleteMemo(id);

    await queryClient.invalidateQueries(['memo-list']);
  });

  const onBaseClick = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
    if (selectedId === memo.id) {
      onCollapse?.(memo);
      return;
    }

    const path = event.nativeEvent.composedPath();

    const isIconClicked = path.some((target) => target instanceof HTMLElement && target.classList.contains('icon'));
    if (isIconClicked) onCollapse?.(memo);
    else onClick?.(memo);
  }, [memo, onClick, onCollapse, selectedId]);

  const onMenuClick = useCallback((item: DropDownItem) => {
    if (item.id === 'delete') deleteMutation.mutate(memo.id);
  }, []);

  return (
    <li
      className={cx(
        `
          w-full
          flex flex-row justfiy-start items-center p-2
          cursor-pointer rounded-lg transition-colors ease-out
          hover:bg-gray-200 active:bg-gray-300 focus:bg-gray-300
          dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:focus:bg-gray-700
        `,
        selectedId !== memo.id && `text-gray-900 dark:text-gray-100`,
        selectedId === memo.id && `bg-primary-100 text-primary-500 hover:bg-primary-200 active:bg-primary-300 focus:bg-primary-300
       dark:bg-primary-950 dark:hover:bg-primary-900 dark:active:bg-primary-800 dark:focus:bg-primary-800`,
      )}
      onClick={onBaseClick}
    >
      {depth > 0 && <div style={{ width: `${depth * 1.5}rem` }} className={'shrink-0'} />}
      {(memo.children?.length ?? 0) > 0 && (
        <i
          className={cx(
            `material-symbols-outlined icon w-6 h-6 text-base shrink-0
            transition-rotate origin-center ease-out duration-200`,
            open && 'rotate-90'
          )}
        >
          chevron_right
        </i>
      )}
      <div className={'text-base truncate flex-1'}>
        {memo.name}
      </div>
      <DropDown data={TREE_MENU_LIST} onClick={onMenuClick}>
        <button className={'btn-text flex p-0 px-1 rounded-md'}>
          <i className={'material-symbols-outlined icon text-base'}>
            more_vert
          </i>
        </button>
      </DropDown>
    </li>
  );
};

export default MemoTreeItem;
