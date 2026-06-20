'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import ProtectedRoute from '@/components/ProtectedRoute';
import axiosInstance from '@/lib/axios';

function EditModal({ comment, onClose, onSave }) {
  const [text, setText] = useState(comment.comment);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    setError('');
    try {
      await axiosInstance.put(`/api/comments/${comment._id}`, { comment: text.trim() });
      onSave(comment._id, text.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Comment</h3>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E] resize-none"
        />
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !text.trim()}
            className="flex-1 py-2 bg-[#1A3C5E] text-white text-sm rounded-lg hover:bg-[#15304a] disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ comment, deleting, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaTrash className="text-red-600" />
          <h3 className="text-lg font-bold text-gray-800">Delete Comment</h3>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          Are you sure you want to delete this comment? This action cannot be undone.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(comment._id)}
            disabled={deleting}
            className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserCommentsContent() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/comments/user/my-comments');
      setComments(res.data);
    } catch {
      setError('Failed to load your comments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComments();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchComments]);

  const handleSave = (id, newText) => {
    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, comment: newText } : c))
    );
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setCommentToDelete(null);
      await fetchComments();
      toast.success('Comment deleted!');
    } catch {
      setError('Failed to delete comment. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {editingComment && (
        <EditModal
          comment={editingComment}
          onClose={() => setEditingComment(null)}
          onSave={handleSave}
        />
      )}

      {commentToDelete && (
        <DeleteModal
          comment={commentToDelete}
          deleting={deletingId === commentToDelete._id}
          onClose={() => setCommentToDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">My Comments</h1>

      {loading && (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <span className="text-5xl">💬</span>
          <p className="mt-4 text-gray-500 font-medium">You have not posted any comments yet.</p>
        </div>
      )}

      {!loading && !error && comments.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {comments.map((c) => (
            <div key={c._id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-700 leading-relaxed flex-1">{c.comment}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingComment(c)}
                    className="px-3 py-1.5 text-xs font-medium text-[#1A3C5E] border border-[#1A3C5E]/30 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setCommentToDelete(c)}
                    disabled={deletingId === c._id}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserCommentsPage() {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <UserCommentsContent />
    </ProtectedRoute>
  );
}
