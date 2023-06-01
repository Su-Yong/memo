import { useEditor, EditorContent } from '@tiptap/react'
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { CLIENT_COLOR, CLIENT_USER } from '../store/auth';
import React, { useEffect } from 'react';
import Spinner from '../components/common/Spinner';
import { cx } from '../utils/className';
import { useHocuspocusProvider } from '../hooks/useHocuspocusProvider';
import { useAtomValue } from 'jotai';
import { extensions } from '@suyong/memo-core';

export interface EditorProps {
  id: string;
}
const Editor = ({ id }: EditorProps) => {
  const clientUser = useAtomValue(CLIENT_USER);
  const colorData = useAtomValue(CLIENT_COLOR);

  const [provider, isLoading] = useHocuspocusProvider(id);

  const editor = useEditor({
    extensions: [
      ...extensions,
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          id: clientUser?.id,
          name: clientUser?.name,
          color: colorData?.[0],
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
    provider.setAwarenessField('attached', true);

    return () => {
      provider.setAwarenessField('attached', false);
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
      <EditorContent editor={editor} className={'w-full h-full px-4 py-2'} />
    </div>
  );
};

export default React.memo(Editor);
