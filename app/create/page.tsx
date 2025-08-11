import React from 'react'
import BaseSelectionBar from './BaseSelectionBar'
import { PrismaClient } from '../generated/prisma'
import Form from 'next/form'
import { Runware } from "@runware/sdk-js";

const apiKey = process.env.RUNWARE_API_KEY;
if (!apiKey) {
  throw new Error("Missing RUNWARE_API_KEY");
}
const runware = new Runware({ apiKey: apiKey });


async function sendRunwareGeneration(formData: FormData) {
  'use server';
  const prisma = new PrismaClient();
  console.log(formData);
  const prompt = formData.get('prompt');
    const baseImageUrl = formData.get('baseImageUrl');
    // read passed image dimensions
    const widthField = formData.get('baseImageWidth');
    const heightField = formData.get('baseImageHeight');
    const width = typeof widthField === 'string' ? parseInt(widthField, 10) : undefined;
    const height = typeof heightField === 'string' ? parseInt(heightField, 10) : undefined;
  if (typeof prompt !== 'string' || prompt.trim() === '') {
    console.log('No prompt provided.');
    return;
  }
  if (typeof baseImageUrl !== 'string' || !baseImageUrl.trim()) {
    console.log('No base image URL provided.');
    return;
  }
    const images = await runware.requestImages({
      positivePrompt: prompt,
      model: "runware:101@1",
      seedImage: baseImageUrl,
      width,
      height,
      strength: 0.6,
    });
  console.log('Generated images:', images);
  if (!images || images.length === 0 || typeof images[0].imageURL !== 'string') {
    console.log('No images generated.');
    return;
  }
  const baseImage = await prisma.baseImage.findUnique({
    where: { url: baseImageUrl }
  });

  if (!baseImage) {
    console.log('Base image not found.');
    return;
  } else {
    console.log('Base image id found:', baseImage.id);
  }
  await prisma.generation.create({
    data: {
      title: prompt,
      url: images[0].imageURL,
      authorId: 1,
      baseImageId: baseImage.id
    }
  });
  console.log("prisma generation created");
}

const CreatePage = async () => {
  const prisma = new PrismaClient();
  const baseImages = await prisma.baseImage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <BaseSelectionBar baseImages={baseImages} />
      <Form action={sendRunwareGeneration} className='flex flex-col items-center space-y-4 p-10'>
        <img
          src={baseImages[0]?.url}
          alt='Base Image Preview'
          width={300}
          height={300}
          className='rounded-lg shadow-lg'
          id='baseimage-preview'
        />
        <input
          name='prompt'
          type='text'
          placeholder='Enter your prompt here'
          className='w-full max-w-md p-2 border border-gray-300 rounded-lg'
        />
        <input
          type='hidden'
          name='baseImageUrl'
          id='baseImageUrl'
          value={baseImages[0]?.url}
        />
          <input
            type='hidden'
            name='baseImageWidth'
            id='baseImageWidth'
            value={baseImages[0]?.width}
          />
          <input
            type='hidden'
            name='baseImageHeight'
            id='baseImageHeight'
            value={baseImages[0]?.height}
          />
        <input
          type='submit'
          className='cursor-pointer bg-white text-black font-bold text-lg py-1 px-3 rounded'
          value='Generate'
        />
      </Form>
    </div>
  )
}

export default CreatePage