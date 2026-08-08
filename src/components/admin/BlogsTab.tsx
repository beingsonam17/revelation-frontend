'use client';

import React, { useState } from 'react';
import {
  useGetAdminBlogPostsQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  useUploadBlogImageMutation,
} from '@/store/api/blogApi';
import { RichBlogEditor } from './RichBlogEditor';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Search,
  Sparkles,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export function BlogsTab() {
  const { data: blogPosts = [], isLoading, refetch } = useGetAdminBlogPostsQuery();
  const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();
  const [uploadBlogImage, { isLoading: isUploadingCover }] = useUploadBlogImageMutation();

  const [searchQuery, setSearchQuery] = useState('');
  // null = list view, 'create' | 'edit' = editor view
  const [editorMode, setEditorMode] = useState<'create' | 'edit' | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    metaTitle: '',
    metaDesc: '',
    keywords: '',
    isPublished: true,
  });

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadBlogImage(fd).unwrap();
      if (res?.url) setFormData((prev) => ({ ...prev, coverImage: res.url }));
    } catch {
      setSaveError('Failed to upload cover image.');
    }
  };

  const safePosts = Array.isArray(blogPosts) ? blogPosts : [];
  const filteredPosts = safePosts.filter(
    (post: any) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreate = () => {
    setEditingPost(null);
    setSaveError(null);
    setSaveSuccess(false);
    setFormData({
      title: '',
      excerpt: '',
      content: '<h2>Introduction</h2>\n<p>Write your blog post content here...</p>',
      coverImage: '',
      metaTitle: '',
      metaDesc: '',
      keywords: '',
      isPublished: true,
    });
    setEditorMode('create');
  };

  const openEdit = (post: any) => {
    setEditingPost(post);
    setSaveError(null);
    setSaveSuccess(false);
    setFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImage: post.coverImage || '',
      metaTitle: post.metaTitle || '',
      metaDesc: post.metaDesc || '',
      keywords: post.keywords || '',
      isPublished: post.isPublished ?? true,
    });
    setEditorMode('edit');
  };

  const closeEditor = () => {
    setEditorMode(null);
    setEditingPost(null);
    setSaveError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    try {
      if (editorMode === 'edit' && editingPost) {
        await updatePost({ id: editingPost.id, data: formData }).unwrap();
      } else {
        await createPost(formData).unwrap();
      }
      setSaveSuccess(true);
      refetch();
      setTimeout(() => {
        setSaveSuccess(false);
        closeEditor();
      }, 1200);
    } catch (err: any) {
      setSaveError(err?.data || 'Failed to save blog post. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePost(id).unwrap();
      setDeleteConfirmId(null);
      refetch();
    } catch {
      setDeleteError('Failed to delete. Please try again.');
    }
  };

  // ── EDITOR VIEW ──────────────────────────────────────────────────────────
  if (editorMode) {
    return (
      <div className="space-y-5">
        {/* Editor Header */}
        <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={closeEditor}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {editorMode === 'edit' ? 'Edit Blog Article' : 'Compose New Blog Article'}
              </h2>
              {editorMode === 'edit' && editingPost && (
                <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">{editingPost.title}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer mr-2">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-xs font-semibold text-slate-300">Published</span>
            </label>
            <button
              onClick={closeEditor}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              form="blog-editor-form"
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {(isCreating || isUpdating) ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saveSuccess ? (
                '✓ Saved!'
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Article
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {saveError && (
          <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Editor Form */}
        <form id="blog-editor-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Article Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 5 Warning Signs of Termite Infestation in Kathmandu"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-base text-white font-bold focus:outline-none focus:border-amber-500 placeholder-slate-600"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Summary Excerpt *</label>
            <textarea
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Short summary shown on the blog listing page..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 placeholder-slate-600 resize-none"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Article Content *</label>
            <RichBlogEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* Cover Image + SEO — two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cover Image */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Cover Image</label>
              <div className="flex items-center gap-3">
                {formData.coverImage ? (
                  <img src={formData.coverImage} alt="Cover" className="w-16 h-12 object-cover rounded-xl border border-slate-700" />
                ) : (
                  <div className="w-16 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-[10px] text-slate-600">No Image</div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
                />
              </div>
              {isUploadingCover && <p className="text-xs text-amber-400 animate-pulse">Uploading...</p>}
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="Or paste image URL..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600"
              />
            </div>

            {/* SEO Fields */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">SEO Metadata</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO Meta Title"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600"
              />
              <textarea
                rows={2}
                value={formData.metaDesc}
                onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                placeholder="SEO Meta Description"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600 resize-none"
              />
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="Keywords (comma separated)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Blog Articles &amp; SEO ({safePosts.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Compose dynamic blog posts with rich formatting, image uploads, and SEO tags.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl flex items-center gap-2 text-sm transition shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Blog Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title or excerpt..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Delete error */}
      {deleteError && (
        <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Posts List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="text-sm">Loading articles...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <BookOpen className="w-10 h-10 text-slate-700 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">No blog articles found.</p>
          <button onClick={openCreate} className="text-amber-400 text-xs hover:underline">Create your first article →</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post: any) => (
            <div
              key={post.id}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      post.isPublished
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-bold text-white hover:text-amber-400 transition">{post.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </a>
                  <button
                    onClick={() => openEdit(post)}
                    className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  {deleteConfirmId === post.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting}
                        className="px-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setDeleteConfirmId(post.id); setDeleteError(null); }}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
