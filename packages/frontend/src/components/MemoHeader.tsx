import MemoTab from '../containers/MemoTab';

export interface MemoHeaderProps {
  title: string;

  parent?: string;
  back?: string;
}
const MemoHeader = ({ title }: MemoHeaderProps) => {
  return (
    <header
      className={`
        w-full flex flex-col justify-start items-start gap-2 py-3
        bg-gray-100 border-b-[1px] border-gray-300
      `}
    >
      <MemoTab />
      <div className={'w-full flex justify-start items-center gap-2 px-4'}>
        <input className={'w-full font-bold text-2xl outline-none bg-transparent'} value={title} />
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
