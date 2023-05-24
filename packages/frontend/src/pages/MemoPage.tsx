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
    <div className={'w-full h-full bg-gray-50'}>
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
          <button className={'btn-text btn-icon flex'}>
            <label className={'rounded-full w-8 h-8 overflow-hidden flex justify-center items-center bg-gray-200'}>
              {
                clientUser?.profile
                  ? <img src={clientUser?.profile} className={'w-full h-full object-cover'} />
                  : <i className={'material-symbols-outlined icon text-sm'}>
                    person
                  </i>
              }
              <input type="file" accept="image/*" className={'hidden'} onChange={onProfileFile} />
            </label>
          </button>
        </Allotment.Pane>
        <Allotment.Pane
          snap
          minSize={210}
          preferredSize={'30%'}
          className={`w-full h-full`}
        >
          {
            selectedWorkspace
              ? <MemoList workspace={selectedWorkspace} />
              : null
          }
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
