import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMemo, fetchMemoByWorkspace } from '../api/memo';
import MemoTree from './MemoTree';
import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { SELECTED_MEMO_ID } from '../store/memo';
import { WorkspaceResponse as Workspace, MemoResponse as Memo } from '@suyong/memo-core';

export interface MemoListProps {
  workspace: Workspace;
}
const MemoList = ({ workspace }: MemoListProps) => {
  const queryClient = useQueryClient();

  const { data: memoList } = useQuery(
    ['memo-list', workspace.id],
    async () => fetchMemoByWorkspace(workspace.id, { as: 'tree' }),
  );
  const addMemoMutation = useMutation(async () => {
    await createMemo({
      workspaceId: workspace.id,
      name: '새로운 메모',
    });

    await queryClient.invalidateQueries(['memo-list', workspace.id]);
  });

  const [selectedId, setSelectedId] = useAtom(SELECTED_MEMO_ID);

  const onSelect = useCallback((memo: Memo) => {
    setSelectedId(memo.id);
  }, []);

  return (
    <div className={'flex flex-col justify-start items-stretch bg-transparent'}>
      <div className={'w-full h-22 p-3 flex flex-col justify-start items-start'}>
        <h3 className={'w-full flex justify-between items-center font-bold text-xl text-gray-900 dark:text-gray-100'}>
          {workspace.name}
          <button className={'btn-text btn-icon flex'}>
            <i className={'material-symbols-outlined icon'}>
              settings
            </i>
          </button>
        </h3>
        <span className={'text-md text-gray-900 dark:text-gray-100'}>
          {workspace.description}
        </span>
      </div>
      <div className={'w-full h-[1px] bg-gray-300 dark:bg-gray-700'} />
      <div className={'w-full p-3 flex flex-col justify-start items-stretch'}>
        {memoList?.map((memo) => (
          <MemoTree
            key={memo.id}
            memo={memo}
            selectedId={selectedId ?? undefined}
            onSelect={onSelect}
          />
        ))}
        <button
          className={'btn-secondary flex justify-center items-center gap-1'}
          onClick={() => addMemoMutation.mutate()}
        >
          <i className={'material-symbols-outlined icon'}>
            add
          </i>
          새로운 메모
        </button>
      </div>
    </div>
  )
};

export default MemoList;
