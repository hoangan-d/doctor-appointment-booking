"use client"
import { AdminContext } from '@/app/context/AdminContext'
import Image from 'next/image'
import React, { useContext } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const NavbarPanel = () => {

  const { aToken, setAToken } = useContext(AdminContext)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("aToken");
    router.push("/adminLogin");
  };
  return (
    <header className='border-b'>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-2">
        <div className="flex h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <Image src="/healthspot-logo.png" alt='logo' width={200} height={200} />
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>Admin</p>
          </div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>

      </div>
    </header>
  )
}

export default NavbarPanel