import { HocuspocusProvider } from '@hocuspocus/provider';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ACCESS_TOKEN, CLIENT_USER } from '../store/auth';
import { getRandomColor } from '../utils/colors';

export interface EditorProps {
  id: string;
  
}
const Editor = ({ id }: EditorProps) => {
  const token = useAtomValue(ACCESS_TOKEN);
  const provider = useMemo(() => new HocuspocusProvider({
    url: `wss://local.suyong.me/ws/memos/${id}`,
    token,
    name: id,
  }), [id, token]);

  const clientUser = useAtomValue(CLIENT_USER);

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

  return (
    <EditorContent editor={editor} className={'w-full h-full px-4 py-2 overflow-auto'} />
  );
};

export default Editor;
