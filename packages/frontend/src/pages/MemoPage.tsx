import { Allotment } from 'allotment';

import MemoHeader from '../components/MemoHeader';
import Editor from '../containers/Editor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWorkspace } from '../api/workspace';
import { useCallback, useState } from 'react';
import { Workspace } from '../models/Workspace';
import { uploadFile } from '../api/file';
import { useAtomValue } from 'jotai';
import { CLIENT_USER } from '../store/auth';
import { updateUser } from '../api/user';
import { ChangeEvent } from 'react';
import MemoList from '../containers/MemoList';
import Spinner from '../components/common/Spinner';
import { SELECTED_MEMO_ID } from '../store/memo';

const MemoPage = () => {
  const queryClient = useQueryClient();
  const clientUser = useAtomValue(CLIENT_USER);
  const { data: workspaces } = useQuery(['my-workspaces'], async () => fetchWorkspace());
  const profileMutation = useMutation(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (!clientUser) return;
    const fileMetadata = await uploadFile(file);
    const profileUrl = `/api/files/${fileMetadata.id}`;

    await updateUser({ profile: profileUrl });
    await queryClient.invalidateQueries(['client-user']);
  });

  const [selectedWorkspace, setWorkspace] = useState<Workspace | null>(null);
  const selectedId = useAtomValue(SELECTED_MEMO_ID);

  const onToggleWorkspace = useCallback((workspace: Workspace) => {
    if (selectedWorkspace?.id === workspace.id) setWorkspace(null);
    else setWorkspace(workspace);
  }, [selectedWorkspace?.id]);

  const onProfileFile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);

    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    profileMutation.mutate(file);
  }, [profileMutation]);

  return (
    <div className={'w-full h-full bg-gray-100'}>
      <Allotment separator={true}>
        <Allotment.Pane
          minSize={64}
          maxSize={64}
          className={`
            w-full
            h-full
            flex flex-col justify-start items-center gap-3
            p-3
          `}
        >
          {workspaces?.map((workspace) => (
            <button
              key={workspace.id}
              className={`${workspace.id === selectedWorkspace?.id ? 'btn-primary' : 'btn-text'} btn-icon flex`}
              onClick={() => onToggleWorkspace(workspace)}
            >
              <i className={'material-symbols-outlined icon'}>
                folder
              </i>
            </button>
          ))}
          <button className={'btn-text btn-icon flex'}>
            <i className={'material-symbols-outlined icon'}>
              add
            </i>
          </button>
          <div className={'flex-1'}></div>
          <div className={'bg-gray-300 px-3 h-[1px]'}></div>
          <button className={'relative btn-text btn-icon flex'}>
            <label className={'rounded-full w-8 h-8 overflow-hidden flex justify-center items-center bg-gray-200'}>
              {
                clientUser?.profile
                  ? <img src={clientUser?.profile} className={'w-full h-full object-cover'} />
                  : <i className={'material-symbols-outlined icon text-sm'}>
                    person
                  </i>
              }
              <input type="file" accept="image/*" className={'hidden'} onChange={onProfileFile} />
              {profileMutation.isLoading && <Spinner className='absolute w-8 h-8 stroke-primary-500' />}
            </label>
          </button>
        </Allotment.Pane>
        <Allotment.Pane
          snap
          minSize={210}
          preferredSize={280}
          className={`w-full h-full bg-gray-100`}
        >
          {selectedWorkspace && <MemoList workspace={selectedWorkspace} />}
          {!selectedWorkspace && (
            <div className={'w-full h-full flex justify-center items-center p-4'}>
              <div className={'text-gray-400 flex flex-col justify-center items-center'}>
                <i className={'material-symbols-outlined icon text-6xl'}>
                  folder
                </i>
                <div className={'text-2xl font-bold text-center break-keep'}>
                  워크스페이스를 선택해주세요
                </div>
              </div>
            </div>
          )}
        </Allotment.Pane>
        <Allotment.Pane minSize={210} className={'bg-gray-100'}>
          <section className={'w-full h-full flex flex-col justify-start items-stretch'}>
            {typeof selectedId === 'number' && (
              <>
                <MemoHeader />
                <Editor />
              </>
            )}
            {typeof selectedId !== 'number' && (
              <div className={'w-full h-full flex justify-center items-center'}>
                <div className={'text-gray-400 flex flex-col justify-center items-center'}>
                  <i className={'material-symbols-outlined icon text-6xl'}>
                    edit
                  </i>
                  <div className={'text-2xl font-bold text-center break-keep'}>
                    메모를 선택해주세요
                  </div>
                </div>
              </div>
            )}
          </section>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default MemoPage;
