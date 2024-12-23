"use client"
import { LogOut, Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { AppContext } from '@/app/context/AppContext'

const Navbar = () => {
    const currentPath = usePathname();
    const { token, setToken, userData } = useContext(AppContext)
    const page = [
        { name: 'About', path: '/about' },
        { name: 'Doctors', path: '/doctors' },
        { name: 'Contact', path: '/contact' }
    ];
    const isActive = (path: string) => {
        return currentPath === path;
    };

    const handleLogout = () => {
        setToken('')
        localStorage.removeItem('token')
        window.location.reload()
    }


    return (
        <header className='border-b'>
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-2">
                    <div className="flex-1 md:flex md:items-center md:gap-12">
                        <Link className="block text-primary" href="/">
                            <span className="sr-only">Home</span>
                            <Image src="/healthspot-logo.png" alt='logo' width={200} height={200} />
                        </Link>
                    </div>

                    <div className="md:flex md:items-center md:gap-12">
                        <nav aria-label="Global" className="hidden md:block">
                            <ul className="flex items-center gap-6 text-sm">
                                {page.map((page, index) => (
                                    <li key={index} >
                                        <Link href={page.path} className={isActive(page.path) ? 'active' : ''}>
                                            {page.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <Popover>
                            <PopoverTrigger className="block md:hidden">
                                <Menu />
                            </PopoverTrigger>
                            <PopoverContent>
                                <ul className="flex flex-col items-center gap-6 text-sm">
                                    {page.map((page, index) => (
                                        <li key={index} >
                                            <Link href={page.path} className={isActive(page.path) ? 'active' : ''}>
                                                {page.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </PopoverContent>
                        </Popover>

                    </div>

                    <div className="overflow-hidden px-3 rounded-full shadow-inner">
                        {token ?
                            (
                                <Popover >
                                    <PopoverTrigger className="overflow-hidden rounded-full shadow-inner">
                                        <span className="sr-only">Toggle dashboard menu</span>
                                        <img src={userData && (typeof userData.image === 'string' ? userData.image : '/guest.png')} alt='avatar' className="w-8 h-8 rounded-full" />
                                    </PopoverTrigger>
                                    <PopoverContent>

                                        <div className="p-2">
                                            <Link href="/myprofile" className="block rounded-lg px-2 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                My profile
                                            </Link>

                                            <Link href="/myappointment" className="block rounded-lg px-2 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                My appoinment
                                            </Link>

                                            <Link href="#" className="block rounded-lg px-2 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                Team settings
                                            </Link>
                                        </div>

                                        <div className="p-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                                                <LogOut />

                                                Logout
                                            </button>
                                        </div>

                                    </PopoverContent>
                                </Popover>
                            )
                            :
                            (<div className="sm:flex sm:gap-4">
                                <Button asChild className='block rounded-md transition'>
                                    <Link href="/login">Login</Link>
                                </Button>

                                <Button asChild variant='secondary' className='hidden rounded-md transition sm:block'>
                                    <Link href="/register">Register</Link>
                                </Button>

                            </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar