import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { CLIENT_USER } from '../store/auth';
import { getRandomColor } from '../utils/colors';
import React, { useEffect } from 'react';
import Spinner from '../components/common/Spinner';
import { cx } from '../utils/className';
import { useInactiveUsers } from '../hooks/useInactiveUsers';
import { useHocuspocusProvider } from '../hooks/useHocuspocusProvider';
import { useAtomValue } from 'jotai';

export interface EditorProps {
  id: string;
}
const Editor = ({ id }: EditorProps) => {
  const clientUser = useAtomValue(CLIENT_USER);

  const [provider, isLoading] = useHocuspocusProvider(id);
  const inactiveUsers = useInactiveUsers(provider);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: clientUser?.name,
          color: getRandomColor(),
          profile: clientUser?.profile,
        },
        render: (user) => {
          const cursor = document.createElement('span');
          cursor.classList.add('collaboration-cursor__caret');
          cursor.style.setProperty('--color', user.color);

          const container = document.createElement('span');
          container.classList.add('collaboration-cursor__container');

          const label = document.createElement('div');
          label.classList.add('collaboration-cursor__label');
          label.style.setProperty('--color', user.color);

          const profile = document.createElement('img');
          profile.classList.add('collaboration-cursor__profile');
          profile.src = user.profile;
          profile.style.setProperty('--color', user.color);

          label.insertBefore(document.createTextNode(user.name), null);
          container.insertBefore(profile, null);
          container.insertBefore(label, null);
          cursor.insertBefore(container, null);

          return cursor;
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'min-w-full w-full min-h-full h-full prose dark:prose-invert prose-base sm:prose-sm lg:prose-lg focus:outline-none',
      },
    },
    content: '',
    autofocus: true,
  });

  useEffect(() => {
    if (!provider) return;
    provider.setAwarenessField('detached', false);

    return () => {
      provider.setAwarenessField('detached', true);
    };
  }, [provider]);

  return (
    <div
      className={cx(
        'w-full h-full relative overflow-auto',
      )}
    >
      {isLoading && (
        <div className={'absolute inset-0 flex justify-center items-center pointer-events-none'}>
          <Spinner className={'w-8 h-8 stroke-primary-500'} />
        </div>
      )}
      {inactiveUsers.length > 0 && (
        <div className={'fixed bottom-2 right-2 flex justify-center items-center gap-2 pointer-events-none'}>
          {inactiveUsers.map((user) => (
            <div
              className={'px-2 py-1 rounded flex justify-start items-center gap-1'}
              style={{ backgroundColor: user.color }}
            >
              {user.profile && <img src={user.profile} className={'w-4 h-4 object-fit rounded-full'} />}
              {user.name}
            </div>
          ))}
        </div>
      )}
      <EditorContent editor={editor} className={'w-full h-full px-4 py-2'} />
    </div>
  );
};

export default React.memo(Editor);
