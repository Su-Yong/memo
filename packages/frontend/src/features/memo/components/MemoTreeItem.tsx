const MemoTreeItem = () => {
  return (
    <li
      className={`
        flex flex-row justfiy-start items-center gap-1 p-2
        cursor-pointer rounded-lg transition-colors ease-out
        hover:bg-primary-100 active:bg-primary-200 active:text-primary-500 focus:bg-primary-200 focus:text-primary-500
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
