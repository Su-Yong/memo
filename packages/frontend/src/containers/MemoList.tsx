import { useQuery } from '@tanstack/react-query';
import { Workspace } from '../models/Workspace';
import { fetchMemoByWorkspace } from '../api/memo';
import MemoTree from './MemoTree';
import { useCallback } from 'react';
import { Memo } from '../models/Memo';
import { useSetAtom } from 'jotai';
import { SELECTED_MEMO_ID } from '../store/memo';

export interface MemoListProps {
  workspace: Workspace;
}
const MemoList = ({ workspace }: MemoListProps) => {
  const { data: memoList } = useQuery(
    ['memo-list', workspace.id],
    async () => fetchMemoByWorkspace(workspace.id, { as: 'tree' }),
  );

  const setSelectedId = useSetAtom(SELECTED_MEMO_ID);

  const onSelect = useCallback((memo: Memo) => {
    setSelectedId(memo.id);
  }, []);

  return (
    <div className={'flex flex-col justify-start items-stretch'}>
      <div className={'w-full h-22 p-3 flex flex-col justify-start items-start'}>
        <h3 className={'w-full flex justify-between items-center font-bold text-xl'}>
          {workspace.name}
          <button className={'btn-text btn-icon flex'}>
            <i className={'material-symbols-outlined icon'}>
              more_horiz
            </i>
          </button>
        </h3>
        <span className={'text-md'}>
          {workspace.description}
        </span>
      </div>
      <div className={'w-full h-[1px] bg-gray-300 '} />
      <div className={'w-full p-3 flex flex-col justify-start items-stretch'}>
        {memoList?.map((memo) => <MemoTree memo={memo} onSelect={onSelect} />)}
        <button className={'btn-secondary flex justify-center items-center gap-1'}>
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
