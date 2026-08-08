'use client';

import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Video,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  Edit3,
  Columns,
  Upload,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
} from 'lucide-react';
import { useUploadBlogImageMutation } from '@/store/api/blogApi';

interface RichBlogEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function RichBlogEditor({ value, onChange }: RichBlogEditorProps) {
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('editor');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAlignment, setImageAlignment] = useState<'center' | 'left' | 'right' | 'full'>('center');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [uploadImageMutation] = useUploadBlogImageMutation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTextAtCursor = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${before}${selectedText}${after}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadImageMutation(formData).unwrap();
      if (res.url) {
        setImageUrl(res.url);
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInsertImageSubmit = () => {
    if (!imageUrl) return;

    let alignClass = 'mx-auto block text-center my-6 max-w-full rounded-xl shadow-lg';
    if (imageAlignment === 'left') alignClass = 'float-left mr-6 mb-4 max-w-sm rounded-xl shadow-lg';
    if (imageAlignment === 'right') alignClass = 'float-right ml-6 mb-4 max-w-sm rounded-xl shadow-lg';
    if (imageAlignment === 'full') alignClass = 'w-full my-6 rounded-xl shadow-lg';

    const captionHtml = imageCaption
      ? `<figcaption className="text-center text-xs text-slate-400 italic mt-2">${imageCaption}</figcaption>`
      : '';

    const imageSnippet = `\n<figure className="my-6">\n  <img src="${imageUrl}" alt="${imageCaption || 'Blog Image'}" class="${alignClass}" />\n  ${captionHtml}\n</figure>\n`;

    insertTextAtCursor(imageSnippet);
    setShowImageModal(false);
    setImageUrl('');
    setImageCaption('');
  };

  const insertCallout = (type: 'info' | 'warning' | 'tip') => {
    let bg = 'bg-blue-500/10 border-blue-500/30 text-blue-300';
    let title = 'NOTE';
    if (type === 'warning') {
      bg = 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      title = 'WARNING';
    }
    if (type === 'tip') {
      bg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
      title = 'PRO TIP';
    }

    const snippet = `\n<div className="p-4 my-4 rounded-xl border ${bg}">\n  <strong className="block text-xs uppercase tracking-wider mb-1">${title}</strong>\n  <p>Add your important message here...</p>\n</div>\n`;
    insertTextAtCursor(snippet);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-900/90 overflow-hidden shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/80 border-b border-slate-800">
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => insertTextAtCursor('# ', '', 'Heading 1')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor('## ', '', 'Heading 2')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor('### ', '', 'Heading 3')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() => insertTextAtCursor('**', '**', 'bold text')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor('*', '*', 'italic text')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor('~~', '~~', 'strikethrough')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor('`', '`', 'code')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() => insertTextAtCursor('- ', '', 'Bullet item')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor('1. ', '', 'Numbered item')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition flex items-center gap-1.5 text-xs font-semibold"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Add Image</span>
          </button>

          <button
            type="button"
            onClick={() => insertCallout('tip')}
            className="p-2 hover:bg-slate-800 text-emerald-400 rounded-lg transition"
            title="Insert Tip Callout"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertCallout('warning')}
            className="p-2 hover:bg-slate-800 text-amber-400 rounded-lg transition"
            title="Insert Warning Callout"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
              viewMode === 'editor' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
              viewMode === 'split' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
              viewMode === 'preview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[350px]">
        {/* Editor Input Area */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className={`p-4 ${viewMode === 'split' ? 'border-b md:border-b-0 md:border-r border-slate-800' : 'col-span-2'}`}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write your article content here in Markdown or HTML..."
              className="w-full h-full min-h-[320px] bg-transparent text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none resize-y"
            />
          </div>
        )}

        {/* Live Preview Area */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`p-6 bg-slate-950/40 overflow-y-auto max-h-[500px] ${viewMode === 'preview' ? 'col-span-2' : ''}`}>
            <div className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Live Article Preview</span>
              <span>{readingTime} min read ({wordCount} words)</span>
            </div>
            <div
              className="prose prose-invert prose-amber max-w-none text-slate-200 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: value || '<p className="text-slate-600 italic">Preview content will render here...</p>' }}
            />
          </div>
        )}
      </div>

      {/* Modal: Insert Image */}
      {showImageModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>Insert Dynamic Image</span>
            </h3>

            {/* Upload File */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
              />
              {uploadingImage && <p className="text-xs text-amber-400 mt-1 animate-pulse">Uploading image...</p>}
            </div>

            {/* Or Paste URL */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg or /uploads/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Image Caption */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Image Caption (Optional)</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="e.g. Eco-friendly termite treatment application"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Image Alignment Choice */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Alignment</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'center', label: 'Center', icon: AlignCenter },
                  { id: 'left', label: 'Left', icon: AlignLeft },
                  { id: 'right', label: 'Right', icon: AlignRight },
                  { id: 'full', label: 'Full', icon: Maximize2 },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = imageAlignment === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setImageAlignment(item.id as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Insert Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImageSubmit}
                disabled={!imageUrl}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm disabled:opacity-50 transition shadow-lg"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
