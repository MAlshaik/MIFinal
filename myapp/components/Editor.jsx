import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from "tiptap-markdown";
import TiptapUnderline from "@tiptap/extension-underline";
import Link from '@tiptap/extension-link'

export const TiptapEditor = forwardRef((props, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        placeholder: ({ node, editor }) => {
          if (editor.isEmpty) {
            return "Untitled";
          }
          const headingPlaceholders = { 
            1: "Heading 1", 
            2: "Heading 2", 
            3: "Heading 3" 
          };
          return headingPlaceholders[node.attrs.level] || '';
        },
      }),
      Markdown.configure({
        html: false,
        linkify: true,
        transformCopiedText: true,
        transformPastedText: true,
      }),
      TiptapUnderline,
      Link.configure({
        openOnClick: true,
        autolink: false,
      }),
    ],
    enablePasteRules: true,
    onUpdate: ({ editor }) => {
      const transaction = editor.state.tr.setMeta('forceUpdatePlaceholder', true);
      editor.view.dispatch(transaction);
    },
  });

  useImperativeHandle(ref, () => ({
    setContent: (content) => {
      editor?.commands.setContent(content);
    },
    appendContent: (content, linebreakCount = 0) => {
      if (editor) {
        editor.commands.focus('end')
        if (!editor.isEmpty) {
          editor.chain().insertContent(content).run();   
          for (let i = 0; i < linebreakCount; i++) {
            editor.commands.enter();
          }  
        } else {
          editor.chain().insertContent("\n").run();
          editor.commands.setContent(content);
        }
      }
    },
    clearContent: () => {
      editor?.commands.setContent("");
    },
    getHTML: () => {
      return editor?.getHTML(); 
    },  
  }));

  useEffect(() => {
    if (editor) {
      editor.commands.setContent("Enter your notes here and save when you are done...");
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh", 
        maxWidth: "80vw", 
        minWidth: "75vw", 
        width: "80%", 
        margin: "auto",
        overflow: "auto",
        padding: "20px",
      }}
    >
      <EditorContent className="markdownPreview" editor={editor} />
    </div>
  );
});

export default TiptapEditor;

