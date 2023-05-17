import { Allotment } from 'allotment';

import MemoTreeItem from '../containers/MemoTreeItem';

const MemoPage = () => {
  return (
    <div className={'w-full h-full bg-gray-50'}>
      <Allotment separator={false}>
        <Allotment.Pane
          snap
          minSize={210}
          preferredSize={210}
          className={`
            flex flex-col justify-start items-stretch gap-0 p-2
            bg-gray-100
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
          section
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default MemoPage;
