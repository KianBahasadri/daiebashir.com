'use client';

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

interface CreateFormProps {
  baseImages: any[];
  action: (formData: FormData) => Promise<void>;
}

export default function CreateForm({ baseImages, action }: CreateFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default behavior if needed
    // event.preventDefault(); // if you want to prevent form submission, but since action is server action it may be handled natively
    alert('Image generating, please wait');
  };
  const notify = () => toast("Image generating");

  return (
    <div>
      <ToastContainer theme="dark" />
      <form action={action} onSubmit={notify} className="flex flex-col items-center space-y-4">
        <img
          src={baseImages[0]?.url}
          alt="Base Image Preview"
          width={300}
          height={300}
          className="rounded-lg shadow-lg"
          id="baseimage-preview"
        />
        <input
          name="prompt"
          type="text"
          placeholder="Enter your prompt here"
          className="w-full max-w-md p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="hidden"
          name="baseImageUrl"
          id="baseImageUrl"
          value={baseImages[0]?.url}
        />
        <input
          type="hidden"
          name="baseImageWidth"
          id="baseImageWidth"
          value={baseImages[0]?.width}
        />
        <input
          type="hidden"
          name="baseImageHeight"
          id="baseImageHeight"
          value={baseImages[0]?.height}
        />
        <input
          type="submit"
          className="cursor-pointer bg-white text-black font-bold text-lg py-1 px-3 rounded"
          value="Generate"
        />
      </form>
    </div>
  );
}
