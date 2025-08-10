import Link from 'next/link'
import React from 'react'

const NavBar = () => {
  return (
    <nav className="bg-black w-48 h-screen p-6 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="text-white text-xl font-semibold">
          daiebashir.com
        </Link>
      </div>
      <div className="flex flex-col space-y-4">
        <Link href="/generate" className="text-white ">
          Generate
        </Link>
        <Link href="/contact" className="text-white">
          Contact
        </Link>
        <Link href="/admin" className="text-white">
          Admin
        </Link>
      </div>
    </nav>
  )
}

export default NavBar