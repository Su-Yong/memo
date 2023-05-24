import MemoTreeItem from '../components/MemoTreeItem';
import { Memo } from '../models/Memo';

export interface MemoTreeProps {
  memo: Memo;
  depth?: number;
}

const MemoTree = ({ memo, depth = 0 }: MemoTreeProps) => {
  return (
    <>
      <MemoTreeItem memo={memo} />
      {
        memo.children?.map((item) => <MemoTreeItem memo={item} depth={depth + 1} />)
      }
    </>
  );
};

export default MemoTree;
