import { useAtomValue } from 'jotai';
import { SELECTED_MEMO_ID, TAB_MEMO_ID_LIST } from '../store/memo';
import MemoTabItem from '../components/MemoTabItem';

const MemoTab = () => {
  const memoIdList = useAtomValue(TAB_MEMO_ID_LIST);
  const selectedMemoId = useAtomValue(SELECTED_MEMO_ID);

  return (
    <div
      className={`
        w-full h-10 flex flex-row justify-start items-center gap-2 px-3
        bg-gray-100 overflow-x-auto dark:bg-gray-900
      `}
    >
      {memoIdList.map((memoId) => (
        <MemoTabItem
          key={memoId}
          memoId={memoId}
          selected={memoId === selectedMemoId}
        />
      ))}
    </div>
  )
};

export default MemoTab;
