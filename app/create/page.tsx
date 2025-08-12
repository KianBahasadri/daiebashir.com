import { redirect } from 'next/navigation'
import React from 'react'
import BaseSelectionBar from './BaseSelectionBar'
import { PrismaClient } from '../generated/prisma'
import { Runware } from "@runware/sdk-js";
import CreateForm from './CreateForm';

export const dynamic = 'force-dynamic';

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
    strength: 0.71,
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

  // after a successful create, redirect back here with a flag
  redirect('/create?imageUrl=' + encodeURIComponent(images[0].imageURL));
}

// inline props type for Next.js App Router

const CreatePage = async ({ searchParams }: any) => {
  const prisma = new PrismaClient();
  const baseImages = await prisma.baseImage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const params = await searchParams
  const imageUrl = params.imageUrl;
  const didSucceed = typeof imageUrl === 'string';

  return (
    <div>
      <BaseSelectionBar baseImages={baseImages} />
      <div className='flex justify-center space-x-16'>
        <CreateForm baseImages={baseImages} action={sendRunwareGeneration} />
        {didSucceed && (
          <div>
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-center max-w-md mx-auto">
              🎉 Image generated successfully!
              <img
                src={imageUrl!}
                alt='Generated Image'
                className='mt-2 rounded-lg shadow-lg mx-auto'
                width={300}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreatePage