"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Minus,
  FileUp,
  Video,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useDialog } from "@/components/ui/dialog";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function stripScriptsFromHtml(html: string): string {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    blockquote: {},
    bulletList: {},
    orderedList: {},
    codeBlock: {},
    horizontalRule: {},
  }),
  Underline,
  TaskList,
  TaskItem.configure({ nested: true }),
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Link.configure({ openOnClick: false, autolink: true }),
  Image.configure({ inline: false, allowBase64: true }),
  Placeholder.configure({ placeholder: "Write your article…" }),
];

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { prompt, toast } = useDialog();

  const editor = useEditor({
    extensions: editorExtensions,
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-editor focus:outline-none min-h-[420px] px-4 py-3",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
            insertImageUpload(file, pos);
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event) => {
        if (event.clipboardData?.files?.[0]) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith("image/")) {
            insertImageUpload(file);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  const insertImageUpload = (file: File, pos?: number) => {
    prompt({
      title: "Image alt text",
      description: "Describe the image for SEO and accessibility (required).",
      placeholder: "e.g. NEPSE daily chart showing breakout",
      confirmLabel: "Next",
      onSubmit: (alt) => {
        if (!alt.trim()) {
          toast("Image alt text is required for SEO", "error");
          return;
        }
        
        prompt({
          title: "Image caption (Optional)",
          description: "Caption to display below the image.",
          placeholder: "e.g. Source: TradingView",
          confirmLabel: "Upload & Insert",
          onSubmit: async (caption) => {
            const formData = new FormData();
            formData.append("file", file);
            
            try {
              toast("Uploading image...", "default");
              const res = await fetch("/api/upload/image", { method: "POST", body: formData });
              if (!res.ok) throw new Error("Upload failed");
              const data = await res.json();
              const url = data.url;

              const attrs = { src: url, alt: alt.trim(), title: caption.trim() || undefined };
              
              if (pos !== undefined) {
                editor?.chain().focus().insertContentAt(pos, { type: "image", attrs }).run();
              } else {
                editor?.chain().focus().setImage(attrs).run();
              }
              
              toast("Image inserted successfully", "success");
            } catch (err) {
              console.error(err);
              toast("Failed to upload image", "error");
            }
          },
        });
      },
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      insertImageUpload(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleDocImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/document", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Document import failed");
      const data = await res.json();
      const safe = stripScriptsFromHtml(data.html || data.text || "");
      editor?.commands.setContent(safe, { emitUpdate: true });
    } catch (err) {
      console.error(err);
      toast("Failed to import document", "error");
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  const addLink = () => {
    const previousUrl = editor?.getAttributes("link").href || "";
    prompt({
      title: "Link URL",
      description: "Leave empty to remove the link.",
      defaultValue: previousUrl,
      placeholder: "https://",
      onSubmit: (url) => {
        if (!url.trim()) {
          editor?.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }
        editor?.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
      },
    });
  };

  const addEmbed = () => {
    prompt({
      title: "Embed URL",
      description: "YouTube, Vimeo, or any embeddable iframe URL.",
      placeholder: "https://www.youtube.com/embed/...",
      onSubmit: (url) => {
        if (!url.trim()) return;
        let embedUrl = url.trim();
        if (embedUrl.includes("youtube.com/watch")) {
          const id = new URL(embedUrl).searchParams.get("v");
          if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
        }
        editor
          ?.chain()
          .focus()
          .insertContent(
            `<div class="embed-responsive"><iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allowfullscreen loading="lazy"></iframe></div><p></p>`
          )
          .run();
      },
    });
  };

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title?: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      type="button"
      className={`p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-40 ${
        isActive ? "bg-muted text-primary" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-border mx-0.5 shrink-0" />;

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/30">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          title="Task list"
        >
          <CheckSquare className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          title="Insert table"
        >
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} title="Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addEmbed} title="Embed (YouTube, iframe)">
          <Video className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Image">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/*"
          className="hidden"
        />

        <ToolbarButton
          onClick={() => docInputRef.current?.click()}
          disabled={isImporting}
          title="Import .docx / .md"
        >
          <FileUp className="w-4 h-4" />
        </ToolbarButton>
        <input
          type="file"
          ref={docInputRef}
          onChange={handleDocImport}
          accept=".docx,.md,.mdx"
          className="hidden"
        />

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {isImporting && (
        <div className="bg-primary/10 text-primary text-xs text-center py-1 font-medium">
          Importing document…
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
