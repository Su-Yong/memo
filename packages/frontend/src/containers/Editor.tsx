import { HocuspocusProvider } from '@hocuspocus/provider';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ACCESS_TOKEN, CLIENT_USER } from '../store/auth';
import { getRandomColor } from '../utils/colors';
import React from 'react';
import { MEMO_PROVIDER_MAP } from '../store/memo';
import Spinner from '../components/common/Spinner';

export interface EditorProps {
  id: string;
}
const Editor = ({ id }: EditorProps) => {
  const isNewProvider = useRef(false);

  const token = useAtomValue(ACCESS_TOKEN);
  const clientUser = useAtomValue(CLIENT_USER);
  const [memoProviders, setMemoProviders] = useAtom(MEMO_PROVIDER_MAP);

  const provider = useMemo(() => {
    let result = memoProviders.get(id);
    if (result) return result;

    isNewProvider.current = true;
    return new HocuspocusProvider({
      url: `wss://local.suyong.me/ws/memos/${id}`,
      token,
      name: id,
    });
  }, [memoProviders, id, token]);

  const [isLoading, setLoading] = useState(isNewProvider.current);

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
        class: 'prose dark:prose-invert prose-base sm:prose-sm lg:prose-lg focus:outline-none',
      },
    },
    content: '',
    autofocus: true,
  });

  useEffect(() => {
    if (!isNewProvider.current) return;
    if (memoProviders.has(id)) return;

    const newMap = new Map<string, HocuspocusProvider>(memoProviders);
    newMap.set(id, provider);

    setMemoProviders(newMap);
    isNewProvider.current = false;
  }, [id, token, memoProviders, provider]);

  useEffect(() => {
    const provider = memoProviders.get(id);
    const onEndLoad = () => setLoading(false);

    provider?.on('sync', onEndLoad);

    return () => {
      provider?.off('sync', onEndLoad);
    }
  }, [memoProviders, id]);

  return (
    <div className={'w-full h-full relative'}>
      {(isNewProvider.current || isLoading) && (
      <div className={'absolute inset-0 flex justify-center items-center pointer-events-none'}>
        <Spinner className={'w-8 h-8 stroke-primary-500'} />
      </div>
      )}
      <EditorContent editor={editor} className={'w-full h-full px-4 py-2 overflow-auto'} />
    </div>
  );
};

export default React.memo(Editor);
