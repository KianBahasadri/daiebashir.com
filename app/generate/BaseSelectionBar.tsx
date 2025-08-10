import React from 'react'
import { PrismaClient } from '../generated/prisma';
import Image from 'next/image';

const BaseSelectionBar = async () => {
    const prisma = new PrismaClient();
  const baseImages = await prisma.baseImage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <div className='bg-black-500 w-screen p-10 flex'>
        {baseImages.map((image) => (
          <div key={image.id} className='rounded-md overflow-hidden'>
            <Image src={image.url} alt={image.title} width={100} height={300} />
          </div>
        ))}
    </div>
  )
}

export default BaseSelectionBar