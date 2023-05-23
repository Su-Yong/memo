export interface MemoHeaderProps {
  title: string;

  parent?: string;
  back?: string;
}
const MemoHeader = ({ title }: MemoHeaderProps) => {
  return (
    <header className={'flex flex-col justify-start items-start p-2 bg-gray-50'}>
      <div className={'flex justify-start items-center gap-2'}>
        <button className={'btn-text btn-icon flex'}>
          <i className={'material-symbols-outlined icon'}>
            arrow_back
          </i>
        </button>
        <button className={'btn-text btn-icon flex'}>
          <i className={'material-symbols-outlined icon'}>
            arrow_upward
          </i>
        </button>
        <span className={'font-bold text-2xl'}>
          {title}
        </span>
      </div>
    </header>
  )
};

export default MemoHeader;
