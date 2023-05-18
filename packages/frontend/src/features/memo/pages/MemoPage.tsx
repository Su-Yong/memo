import { Allotment } from 'allotment';

import MemoTreeItem from '../components/MemoTreeItem';
import MemoHeader from '../components/MemoHeader';
import Editor from '../containers/Editor';

const MemoPage = () => {
  return (
    <div className={'w-full h-full bg-gray-50'}>
      <Allotment separator={true}>
        <Allotment.Pane
          minSize={64}
          maxSize={64}
          className={`
            flex flex-col justify-start items-center gap-3
            p-3
          `}
        >
          <div className={'rounded-full w-8 h-8 overflow-hidden'}>
            <img src="https://picsum.photos/200" />
          </div>
          <div className={'bg-gray-300 px-3 h-[1px]'}></div>
          <button className={'btn-text btn-icon flex'}>
            <i className={'material-symbols-outlined icon'}>
              folder
            </i>
          </button>
          <button className={'btn-primary btn-icon flex'}>
            <i className={'material-symbols-outlined icon'}>
              folder_open
            </i>
          </button>
          <button className={'btn-text btn-icon flex'}>
            <i className={'material-symbols-outlined icon'}>
              folder_special
            </i>
          </button>
        </Allotment.Pane>
        <Allotment.Pane
          snap
          minSize={210}
          preferredSize={'30%'}
          className={`
            flex flex-col justify-start items-stretch gap-0 p-2
            bg-gray-50
          `}
        >
          <div className={'flex justify-between items-center'}>
            <span className={'font-bold text-lg'}>
              Workspace 1
            </span>
            <button className={'btn-text btn-icon flex'}>
              <i className={'material-symbols-outlined icon'}>
                more_horiz
              </i>
            </button>
          </div>
          <MemoTreeItem />
        </Allotment.Pane>
        <Allotment.Pane minSize={210}>
          <MemoHeader title={'memo1'} />
          <section className={'w-full h-full container mx-auto flex flex-col justify-start items-stretch'}>
            <input
              placeholder={'제목'}
              className={`
                outline-none border-0
                font-extrabold text-[3rem]
                bg-transparent
                px-4
              `}
            />
            <Editor />
          </section>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default MemoPage;
