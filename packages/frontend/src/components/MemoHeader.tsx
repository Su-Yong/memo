import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { fetchMemo } from '../api/memo';
import MemoTab from '../containers/MemoTab';
import { SELECTED_MEMO_ID } from '../store/memo';

const MemoHeader = () => {
  const selectedMemoId = useAtomValue(SELECTED_MEMO_ID);

  const { data: memo } = useQuery(
    ['memo', selectedMemoId],
    async () => typeof selectedMemoId === 'number' ? fetchMemo(selectedMemoId) : null,
  );


  return (
    <header
      className={`
        w-full flex flex-col justify-start items-start gap-2 py-3
        bg-gray-100 border-b-[1px] border-gray-300
      `}
    >
      <MemoTab />
      <div className={'w-full flex justify-start items-center gap-2 px-4'}>
        <input
          className={'w-full font-bold text-2xl outline-none bg-transparent'}
          value={memo?.name}
          onChange={() => {}}
        />
        <div className={'flex-1'}></div>
        <button className={'btn-text btn-icon flex text-md'}>
          <i className={'material-symbols-outlined icon'}>
            close
          </i>
        </button>
      </div>
    </header>
  )
};

export default MemoHeader;
