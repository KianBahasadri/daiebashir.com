import dotenv from 'dotenv';
import { PrismaClient } from '../app/generated/prisma';
import { list } from '@vercel/blob';
import { promisify } from 'util';
import sizeOf from 'image-size';
const sizeOfAsync = promisify(sizeOf);

dotenv.config();

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.generation.deleteMany();
  await prisma.baseImage.deleteMany();
  await prisma.user.deleteMany();

  // Create or find Kian user
  const user1 = await prisma.user.create({
    data: {
      email: 'kian@bashir.com',
      name: 'Kian',
    },
  });

  console.log('✅ Created user');

  // Fetch blob URLs
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN not found in environment variables');
  }

  const { blobs } = await list({ token });
  console.log(`📂 Found ${blobs.length} blob files`);

  // Filter for base images
  const baseImageBlobs = blobs.filter(blob => 
    blob.pathname.match(/baseimage\/.+/)
  );

  const baseImages = [];
  for (const blob of baseImageBlobs) {
    // fetch image and compute dimensions
    const response = await fetch(blob.url);
    const buffer = Buffer.from(await response.arrayBuffer());
    const dimensions = sizeOf(buffer);
    const width = dimensions.width;
    const height = dimensions.height;

    const baseImage = await prisma.baseImage.create({
      data: {
        title: blob.pathname.split('/').pop()?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') || blob.pathname, // Get filename only, remove extension and replace dashes/underscores with spaces
        url: blob.url,
        description: `Base image from ${blob.pathname}`,
        width,
        height
      },
    });
    baseImages.push(baseImage);
  }

  console.log(`✅ Created ${baseImages.length} base images`);

  // Filter for generations
  const imageBlobs = blobs.filter(blob => 
    blob.pathname.match(/generation\/.+/)
  );

  const generations = [];
  for (const blob of imageBlobs) {
    const generation = await prisma.generation.create({
      data: {
        title: blob.pathname.split('/').pop()?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') || blob.pathname, // Get filename only, remove extension and replace dashes/underscores with spaces
        url: blob.url,
        authorId: user1.id,
        baseImageId: baseImages[0].id, // Use the first base image
      },
    });
    generations.push(generation);
  }

  console.log(`✅ Created ${generations.length} generations`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
