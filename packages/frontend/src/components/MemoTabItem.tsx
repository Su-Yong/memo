import { cx } from '../utils/className';
import { fetchMemo } from '../api/memo';
import { useQuery } from '@tanstack/react-query';
import Spinner from './common/Spinner';

export interface MemoTabItemProps {
  memoId: number;
  selected?: boolean;
}
const MemoTabItem = ({ memoId, selected }: MemoTabItemProps) => {
  const { data: memo } = useQuery(
    ['memo', memoId],
    async () => fetchMemo(memoId),
  );

  return (
    <div
      className={cx(
        `
          flex flex-row justify-between items-center gap-2
          pl-3 pr-1 py-1 bg-gray-50 rounded-md shadow-sm
          select-none cursor-pointer
        `,
        selected && 'bg-primary-100 font-bold',
      )}
    >
      {memo && memo.name}
      {!memo && <Spinner className={'w-8 h-8 stroke-gray-300'} />}
      <button className={'btn-text btn-icon p-1 flex'}>
        <i className={'material-symbols-outlined icon text-sm'}>
          close
        </i>
      </button>
    </div>
  );
};

export default MemoTabItem;
