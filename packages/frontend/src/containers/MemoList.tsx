import { useQuery } from '@tanstack/react-query';
import { Workspace } from '../models/Workspace';
import { fetchMemo } from '../api/memo';
import MemoTree from './MemoTree';

export interface MemoListProps {
  workspace: Workspace;
}
const MemoList = ({ workspace }: MemoListProps) => {
  const { data: memoList } = useQuery(
    ['memo-list', workspace.id],
    async () => fetchMemo(workspace.id, { as: 'tree' }),
  );

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
      <div className={'w-full p-3 flex flex-col justify-start items-stretch gap-2'}>
        {memoList?.map((memo) => <MemoTree memo={memo} />)}
        <button className={'btn-text flex items-center gap-1'}>
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
