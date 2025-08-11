'use client'
import React, { useState } from 'react'
import type { BaseImage } from '../generated/prisma'
import classNames from 'classnames'

interface BaseSelectionBarProps {
  baseImages: BaseImage[]
}

const BaseSelectionBar: React.FC<BaseSelectionBarProps> = ({ baseImages }) => {
  const [selectedBaseImageId, setSelectedBaseImageId] = useState<number>(
    baseImages[0]?.id ?? 1
  );

  return (
    <div className='bg-black-500 w-screen p-10 text-center'>
      <h1 className='text-white text-3xl font-semibold pb-4'> Select a Base Image </h1>
      <div className='flex space-x-4'>
        {baseImages.map((image) => (
          <div key={image.id}>
            <div
              onClick={() => {
                console.log("selected base image id:", image.id);
                setSelectedBaseImageId(image.id);
                document.getElementById('baseimage-preview')!.setAttribute('src', image.url);
                document.getElementById('baseImageUrl')!.setAttribute('value', image.url);
                document.getElementById('baseImageWidth')!.setAttribute('value', image.width.toString());
                document.getElementById('baseImageHeight')!.setAttribute('value', image.height.toString());
              }}
              className={classNames({
                 'rounded-md overflow-hidden cursor-pointer': true,
                 'ring-2 ring-blue-500': selectedBaseImageId === image.id
               })}>
               <img src={image.url} alt={image.title} width={100} height={300} />
             </div>
           </div>
         ))}
       </div>
     </div>
   )
 }
 
 export default BaseSelectionBar