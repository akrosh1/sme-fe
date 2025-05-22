'use client';

import '@/components/common/richTextEditor/tiptap-style.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toggle } from '@/components/ui/toggle';
import BulletList from '@tiptap/extension-bullet-list';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  UnderlineIcon,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';
import FormatToggle from './formatToggle';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      BulletList,
      ListItem,
      Text,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Write a note...',
      }),
    ],
    content,
    editable: true,
    editorProps: {
      transformPastedHTML: (html) => html,
      attributes: {
        class:
          'block min-w-prose min-h-prose focus:outline-none outline-1 border-red-500',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Add useEffect to update the editor's content when the `content` prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const toggleFormat = useCallback(
    (
      format:
        | 'toggleBold'
        | 'toggleItalic'
        | 'toggleStrike'
        | 'toggleUnderline',
    ) => {
      if (editor) {
        const command = editor.chain().focus()[format];
        if (typeof command === 'function') {
          command().run();
        }
      }
    },
    [editor],
  );

  const setTextAlign = useCallback(
    (align: 'left' | 'center' | 'right' | 'justify') => {
      editor?.chain().focus().setTextAlign(align).run();
    },
    [editor],
  );

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleHeading = useCallback(
    (level: 1 | 2 | 3 | 4 | 5 | 6) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <div className="border rounded-xl overflow-hidden space-y-2">
      <div className="flex flex-wrap gap-2 border-b pb-2 bg-gray-50 dark:bg-gray-700 p-2">
        <FormatToggle
          editor={editor}
          format="bold"
          icon={<Bold className="h-4 w-4" />}
          ariaLabel="Toggle bold"
          toggleAction={() => toggleFormat('toggleBold')}
        />
        <FormatToggle
          editor={editor}
          format="italic"
          icon={<Italic className="h-4 w-4" />}
          ariaLabel="Toggle italic"
          toggleAction={() => toggleFormat('toggleItalic')}
        />
        <FormatToggle
          editor={editor}
          format="strike"
          icon={<Strikethrough className="h-4 w-4" />}
          ariaLabel="Toggle strikethrough"
          toggleAction={() => toggleFormat('toggleStrike')}
        />
        <div className="border-l border-gray-300 h-6" />
        <FormatToggle
          editor={editor}
          format="underline"
          icon={<UnderlineIcon className="h-4 w-4" />}
          ariaLabel="Toggle underline"
          toggleAction={() => toggleFormat('toggleUnderline')}
        />
        <FormatToggle
          editor={editor}
          format="bulletList"
          icon={<List className="h-4 w-4" />}
          ariaLabel="Toggle bullet list"
          toggleAction={toggleBulletList}
        />
        <FormatToggle
          editor={editor}
          format="orderedList"
          icon={<ListOrdered className="h-4 w-4" />}
          ariaLabel="Toggle ordered list"
          toggleAction={toggleOrderedList}
        />
        <div className="border-l border-gray-300 h-6" />
        <FormatToggle
          editor={editor}
          format={{ textAlign: 'left' }}
          icon={<AlignLeft className="h-4 w-4" />}
          ariaLabel="Align left"
          toggleAction={() => setTextAlign('left')}
        />
        <FormatToggle
          editor={editor}
          format={{ textAlign: 'center' }}
          icon={<AlignCenter className="h-4 w-4" />}
          ariaLabel="Align center"
          toggleAction={() => setTextAlign('center')}
        />
        <div className="border-l border-gray-300 h-6" />
        <FormatToggle
          editor={editor}
          format={{ textAlign: 'right' }}
          icon={<AlignRight className="h-4 w-4" />}
          ariaLabel="Align right"
          toggleAction={() => setTextAlign('right')}
        />
        <FormatToggle
          editor={editor}
          format={{ textAlign: 'justify' }}
          icon={<AlignJustify className="h-4 w-4" />}
          ariaLabel="Justify"
          toggleAction={() => setTextAlign('justify')}
        />
        <div className="border-l border-gray-300 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('heading')}
              aria-label="Toggle heading"
            >
              <Heading className="h-4 w-4" />
            </Toggle>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className={
                editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''
              }
              onClick={() => toggleHeading(1)}
            >
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              className={
                editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''
              }
              onClick={() => toggleHeading(2)}
            >
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              className={
                editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''
              }
              onClick={() => toggleHeading(3)}
            >
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem
              className={
                editor.isActive('heading', { level: 4 }) ? 'bg-accent' : ''
              }
              onClick={() => toggleHeading(4)}
            >
              Heading 4
            </DropdownMenuItem>
            <DropdownMenuItem
              className={
                editor.isActive('heading', { level: 5 }) ? 'bg-accent' : ''
              }
              onClick={() => toggleHeading(5)}
            >
              Heading 5
            </DropdownMenuItem>
            <DropdownMenuItem
              className={
                editor.isActive('heading', { level: 6 }) ? 'bg-accent' : ''
              }
              onClick={() => toggleHeading(6)}
            >
              Heading 6
            </DropdownMenuItem>
            <DropdownMenuItem
              className={!editor.isActive('heading') ? 'bg-accent' : ''}
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              Paragraph
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none px-2 overflow-y-auto"
      />
    </div>
  );
}
