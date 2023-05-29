import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { fetchMemo, updateMemo } from '../api/memo';
import MemoTab from '../containers/MemoTab';
import { SELECTED_MEMO_ID } from '../store/memo';
import { useCallback, useEffect, useRef } from 'react';

const MemoHeader = () => {
  const queryClient = useQueryClient();

  const selectedMemoId = useAtomValue(SELECTED_MEMO_ID);

  const titleRef = useRef<HTMLInputElement>(null);

  const { data: memo } = useQuery(
    ['memo', selectedMemoId],
    async () => typeof selectedMemoId === 'string' ? fetchMemo(selectedMemoId) : null,
  );
  const titleMutation = useMutation(async (title: string) => {
    if (typeof selectedMemoId !== 'string') return;

    await updateMemo(selectedMemoId, { name: title });
    await queryClient.invalidateQueries(['memo', selectedMemoId]);
    await queryClient.invalidateQueries(['memo-list']);
  });

  const onBlurTitle = useCallback(() => {
    const currentTitle = titleRef.current?.value ?? '';

    if (currentTitle !== memo?.name) titleMutation.mutate(currentTitle);
  }, [memo?.name]);

  useEffect(() => {
    if (!titleRef.current) return;

    titleRef.current.value = memo?.name ?? '';
  }, [memo]);

  return (
    <header
      className={`
        w-full flex flex-col justify-start items-start gap-2 py-2
        bg-gray-100 border-b-[1px] border-gray-300
        dark:bg-gray-900 dark:border-gray-700
      `}
    >
      <MemoTab />
      <div className={'w-full flex justify-start items-center gap-2 px-4'}>
        <input
          ref={titleRef}
          className={'w-full font-bold text-2xl outline-none bg-transparent text-gray-900 dark:text-gray-100'}
          onBlur={onBlurTitle}
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
