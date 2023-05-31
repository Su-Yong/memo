import { TAB_MEMO_ID_LIST, TREE_OPEN_MEMO_ID_LIST } from '../store/memo';
import MemoTreeItem from '../components/MemoTreeItem';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { Transition } from '@headlessui/react';
import { MemoTreeResponse as Memo } from '@suyong/memo-core';

export interface MemoTreeProps {
  memo: Memo;
  depth?: number;
  selectedId?: string;

  onSelect?: (memo: Memo) => void;
}

const MemoTree = ({
  memo,
  selectedId,
  depth = 0,
  onSelect,
}: MemoTreeProps) => {
  const [openMemoIdList, setOpenMemoIdList] = useAtom(TREE_OPEN_MEMO_ID_LIST);
  const setTabMemoIdList = useSetAtom(TAB_MEMO_ID_LIST);

  const onToggleCollapse = useCallback(() => {
    setOpenMemoIdList((prev) => {
      if (prev.includes(memo.id)) return prev.filter((id) => id !== memo.id);

      return [...prev, memo.id];
    });
  }, [memo.id, setOpenMemoIdList]);

  const onClick = useCallback((target: Memo) => {
    onSelect?.(target);

    setTabMemoIdList((prev) => {
      if (prev.includes(target.id)) return prev;

      return [...prev, target.id];
    });
  }, [onSelect, setTabMemoIdList]);

  return (
    <>
      <MemoTreeItem
        memo={memo}
        depth={depth}
        selectedId={selectedId}
        open={openMemoIdList.includes(memo.id)}
        onClick={onClick}
        onCollapse={onToggleCollapse}
      />
      <Transition
        show={openMemoIdList.includes(memo.id)}
        enter="transition-all duration-75"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100"
        leave="transition-all duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 -translate-y-2"
      >
        {memo.children?.map((item) => (
          <MemoTree
            key={item.id}
            memo={item}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </Transition>
    </>
  );
};

export default MemoTree;
