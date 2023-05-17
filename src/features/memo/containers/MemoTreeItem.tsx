const MemoTreeItem = () => {
  return (
    <li
      className={`
        flex flex-row justfiy-start items-center gap-1 p-2
        rounded-lg
        hover:bg-primary-100 active:bg-primary-200 focus:bg-primary-200
      `}
    >
      <i className={'material-symbols-outlined icon'}>
        chevron_right
      </i>
      <div>
        아이템
      </div>
    </li>
  );
};

export default MemoTreeItem;
