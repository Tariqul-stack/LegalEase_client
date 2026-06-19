'use client';

import { useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';

export default function ImageUpload({ onUpload }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result?.success || !result?.data?.url) {
        throw new Error('Image upload failed');
      }

      const uploadedUrl = result.data.url;
      setPreviewUrl(uploadedUrl);
      onUpload?.(uploadedUrl);
    } catch {
      setError('Upload failed, try again');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="h-[60px] w-[60px] rounded-full object-cover border-2 border-[#1A3C5E]/20"
          />
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A3C5E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15304a] disabled:cursor-not-allowed disabled:opacity-70 transition-colors"
        >
          <FaUpload />
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
