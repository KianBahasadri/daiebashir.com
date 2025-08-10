import Image from "next/image";
import { PrismaClient } from "./generated/prisma";
import { useEffect, useRef } from 'react';
import AutoScroll from "./autoScroll";

export default async function Home() {
  const prisma = new PrismaClient();
  const generations = await prisma.generation.findMany({
    include: {
      author: true,
      baseImage: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const baseImages = await prisma.baseImage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <div className="text-center space-y-4 mb-8">
        <h3 className="text-2xl text-gray-300">
          Welcome to the Temple of
        </h3>
        <h1 className="text-6xl font-bold text-white ">
          Daie Bashir
        </h1>
      </div>
      <div>
        <AutoScroll />
        {baseImages.map((baseImage) => (
          <div key={baseImage.id} className="scrolling flex items-center space-x-4 pl-4 overflow-x-auto">
            <div className="rounded-xl overflow-hidden shrink-0 border border-gray-300">
              <Image
                src={baseImage.url}
                alt={baseImage.title}
                width={256}
                height={256}
            />
            </div>
            {generations
              .filter((generation) => generation.baseImageId === baseImage.id)
              .map((generation) => (
                <Image
                  key={generation.id}
                  src={generation.url}
                  alt={generation.title}
                  width={200}
                  height={200}
                  className="shrink-0"
                />
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}
