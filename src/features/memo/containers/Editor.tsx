import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-base sm:prose-sm lg:prose-lg focus:outline-none',
      },
    },
    content: '<p>Hello World!</p>',
    autofocus: true,
  });

  return (  
    <EditorContent editor={editor} className={'w-full h-full px-4 py-2'} />
  );
};

export default Editor;
