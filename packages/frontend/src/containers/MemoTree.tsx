import { TREE_OPEN_MEMO_ID_LIST } from '../store/memo';
import MemoTreeItem from '../components/MemoTreeItem';
import { Memo } from '../models/Memo';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

export interface MemoTreeProps {
  memo: Memo;
  depth?: number;
}

const MemoTree = ({ memo, depth = 0 }: MemoTreeProps) => {
  const [openMemoIdList, setOpenMemoIdList] = useAtom(TREE_OPEN_MEMO_ID_LIST);

  const onToggleCollapse = useCallback(() => {
    setOpenMemoIdList((prev) => {
      if (prev.includes(memo.id)) return prev.filter((id) => id !== memo.id);

      return [...prev, memo.id];
    });
  }, [memo.id, setOpenMemoIdList]);

  const onClick = () => {
    alert(`memo click: ${memo.id}`);
  };

  return (
    <>
      <MemoTreeItem memo={memo} depth={depth} onClick={onClick} onCollapse={onToggleCollapse} />
      {openMemoIdList.includes(memo.id) && memo.children?.map((item) => (
        <MemoTree memo={item} depth={depth + 1} />
      ))}
    </>
  );
};

export default MemoTree;
