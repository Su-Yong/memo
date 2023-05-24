import { Memo } from '../models/Memo';

export interface MemoTreeItemProps {
  memo: Memo;
  depth?: number;
}
const MemoTreeItem = ({
  memo,
  depth = 0,
}: MemoTreeItemProps) => {
  return (
    <li
      className={`
        flex flex-row justfiy-start items-center gap-1 p-2
        cursor-pointer rounded-lg transition-colors ease-out
        hover:bg-primary-100 active:bg-primary-200 active:text-primary-500 focus:bg-primary-200 focus:text-primary-500
      `}
    >
      {depth > 0 && <div style={{ width: `${depth * 1.5}rem` }} />}
      {
        (memo.children?.length ?? 0) > 0
          ? (
            <i className={'material-symbols-outlined icon w-6 h-6'}>
              chevron_right
            </i>
          )
          : null
      }
      <div className={'text-base'}>
        {memo.name}
      </div>
    </li>
  );
};

export default MemoTreeItem;
