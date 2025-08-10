import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { put } from "@vercel/blob";

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

  // TODO validation check
  if (!imageFile || !(imageFile instanceof File)) {
    return new Response(typeof(imageFile), { status: 400 });
  }

  // Upload the image to Vercel Blob Storage under 'baseimage/<filename>'
  const fileName = `baseimage/${imageFile.name}`;
  const { url } = await put(fileName, imageFile, { access: 'public' });

  return new Response(JSON.stringify({ message: 'Image uploaded successfully', url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}