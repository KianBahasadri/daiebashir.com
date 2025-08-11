import Link from 'next/link'
import React from 'react'
import MusicPlayer from './MusicPlayer'

const tracklist = ['1.mp3', '2.mp3', '3.mp3'].map((file) => `/music/${file}`) // Static track list to avoid filesystem cwd issues on Vercel

const NavBar = () => {
  return (
    <nav className="bg-linear-to-l from-black-500 to-gray-900 w-48 h-screen p-6 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="text-white text-xl font-semibold">
          daiebashir.com
        </Link>
      </div>
      <div className="flex flex-col space-y-4">
        <Link href="/" className="text-white">
          Home
        </Link>
        <Link href="/create" className="text-white ">
          Create
        </Link>
        <Link href="/contact" className="text-white">
          Contact
        </Link>
        <Link href="/admin" className="text-white">
          Admin
        </Link>
      </div>
      <div className="fixed bottom-16">
        <MusicPlayer tracks={tracklist} />
      </div>
    </nav>
  )
}

export default NavBar