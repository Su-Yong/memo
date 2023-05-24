import { Memo } from '../models/Memo';
import React, { useCallback } from 'react';
import { cx } from '../utils/className';

export interface MemoTreeItemProps {
  memo: Memo;
  selectedId?: number;
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

  return (
    <li
      className={cx(
        `
          flex flex-row justfiy-start items-center p-2
          cursor-pointer rounded-lg transition-colors ease-out
          hover:bg-primary-100 active:bg-primary-200 focus:bg-primary-200
        `,
        selectedId === memo.id && 'bg-primary-100 text-primary-500',
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
      <div className={'text-base truncate'}>
        {memo.name}
      </div>
    </li>
  );
};

export default MemoTreeItem;
