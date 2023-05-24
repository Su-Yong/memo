import { Memo } from '../models/Memo';

export interface MemoTabProps {
  memoList: Memo[];
  selectedMemoId: number;
}
const MemoTab = ({ memoList, selectedMemoId }: MemoTabProps) => {
  return (
    <div
      className={`
        flex flex-row justify-start items-center gap-2 p-2
        bg-gray-100
      `}
    >
      {memoList.map((memo) => (
        <div
          className={`
            flex flex-row justify-between items-center gap-2
            pl-3 pr-1 py-1 bg-gray-50 rounded-md shadow-sm font-bold
          `}
        >
          {memo.name}
          <button className={'btn-text btn-icon p-1 flex'}>
            <i className={'material-symbols-outlined icon text-sm'}>
              close
            </i>
          </button>
        </div>
      ))}
    </div>
  )
};

export default MemoTab;
