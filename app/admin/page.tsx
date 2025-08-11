"use client";

import React, { useState, useRef, useCallback } from 'react'

const page = () => {
  // state to store preview URL
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  // state to store image dimensions
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  // derived modified dimensions: floor width to nearest multiple of 64, scale height proportionally
  const modifiedDimensions = dimensions
    ? (() => {
        const { width, height } = dimensions;
        const newWidth = Math.floor(width / 64) * 64;
        const newHeight = Math.floor(height / 64) * 64;
        return { width: newWidth, height: newHeight };
      })()
    : null;

  // refs for inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);
  
  // handler to resize and upload
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current || !dimensions || !modifiedDimensions) return;
    const file = fileInputRef.current.files?.[0];
    if (!file) return;
    // load image for drawing
    const img = new Image();
    const url = URL.createObjectURL(file);
    await new Promise<void>(res => { img.onload = () => res(); img.src = url; });
    URL.revokeObjectURL(url);
    // draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = modifiedDimensions.width;
    canvas.height = modifiedDimensions.height;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(img, 0, 0, modifiedDimensions.width, modifiedDimensions.height);
    // convert to blob and send
    canvas.toBlob(async blob => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('image', blob, file.name);
      formData.append('imageWidth', String(modifiedDimensions.width));
      formData.append('imageHeight', String(modifiedDimensions.height));
      formData.append('description', descInputRef.current?.value || '');
      const res = await fetch('/api/addbaseimage', { method: 'POST', body: formData });
      if (res.ok) {
        // reset preview and inputs
        setPreviewSrc(null);
        setDimensions(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (descInputRef.current) descInputRef.current.value = '';
      }
    }, file.type);
  }, [dimensions, modifiedDimensions]);
  
  return (
    <div className='space-y-16 text-center'>
      <div className="space-x-4">
        <h3>Enter Admin Password</h3>
        <form>
          <input type="text" className="border rounded-lg" />
          <button
            className="cursor-pointer text-white p-1 bg-gray-700 hover:bg-gray-500 rounded-lg"
            onClick={event => {
              event.preventDefault();
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              const password = input?.value;
              document.cookie = `admin-password=${password}; path=/api/; Secure; SameSite=Strict`;
              if (input) input.value = '';
            }}
          >
            Submit
          </button>
        </form>
      </div>
      <div>
        <h1>Add Base Image</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            name="image"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-100 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 focus:outline-none"
            ref={fileInputRef}
            onChange={e => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPreviewSrc(url);
                const img = new Image();
                img.onload = () => {
                  setDimensions({ width: img.width, height: img.height });
                  URL.revokeObjectURL(url);
                };
                img.src = url;
              } else {
                setPreviewSrc(null);
                setDimensions(null);
              }
            }}
          />
          <img
            id="baseimage-preview"
            src={previewSrc ?? undefined}
            alt="Base Image Preview"
            className="mt-2 max-h-64 mx-auto"
          />
          <label className="block">
            {dimensions ? `original: ${dimensions.width} x ${dimensions.height}` : ''}
          </label>
          <label className="block mt-1">
            {modifiedDimensions ? `modified: ${modifiedDimensions.width} x ${modifiedDimensions.height}` : ''}
          </label>

          <input name="description" type="text" placeholder="Image Description" className="border rounded-lg ml-4 p-1" ref={descInputRef} />
          <button type="submit" className="cursor-pointer text-white p-1 bg-gray-700 hover:bg-gray-500 rounded-lg">Upload</button>
        </form>
      </div>
    </div>
  )
}

export default page