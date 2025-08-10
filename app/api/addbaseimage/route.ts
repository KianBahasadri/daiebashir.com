import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { put } from "@vercel/blob";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient(); // instantiated prisma client

export async function POST(request: NextRequest) {
  // Check for admin-password cookie
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('admin-password');

  if (!adminCookie || adminCookie.value !== process.env.ADMIN_PASSWORD) {
    return new Response('Forbidden', { status: 403 });
  }

  // Parse the incoming form data
  const formData = await request.formData();
  const imageFile = formData.get('image');
  const imageDescription = formData.get('description');

  // TODO validation check
  if (!imageFile || !(imageFile instanceof File)) {
    return new Response("Invalid image file", { status: 400 });
  }

  if (!imageDescription || typeof imageDescription !== 'string') {
    return new Response("Invalid image description", { status: 400 });
  }

  // Upload the image to Vercel Blob Storage under 'baseimage/<filename>'
  const fileName = `baseimage/${imageFile.name}`;
  const { url } = await put(fileName, imageFile, { access: 'public' });

  // Store the uploaded image info in the database using Prisma
  await prisma.baseImage.create({
    data: {
      title: imageFile.name,
      description: imageDescription,
      url: url
    }
  });

  return new Response(JSON.stringify({ message: 'Image uploaded successfully', url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}