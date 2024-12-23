'use client'
import React, { useContext, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { AdminContext } from '@/app/context/AdminContext';

const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // AdminSidebar toggle state
  const router = useRouter();
  const currentPath = usePathname()

  const { aToken, setAToken } = useContext(AdminContext)

  // Navigation links
  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Appointments', path: '/admin/allAppointments' },
    { name: 'Add Doctor', path: '/admin/addDoctor' },
    { name: 'Doctors List', path: '/admin/doctorslist' },
  ];
  const isActive = (path: string) => {
    return currentPath === path;
  };

  const handleLogout = () => {
    aToken && setAToken('')
    aToken && localStorage.removeItem("aToken");
    router.push("/adminLogin");
  };

  return (
    <div className={`flex flex-col h-screen bg-blue-100 ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      {/* AdminSidebar Header */}
      <div className="flex items-center justify-between px-4 py-1 ">
        <div className={` text-lg font-bold ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col items-center text-xs">
            <Image src="/healthspot-logo.png" alt='logo' width={200} height={200} />
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>Admin</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" focus:outline-none"
        >
          {isOpen ? <ArrowBigLeft /> : <ArrowBigRight />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex-1">
        {navLinks.map((link) => (
          <Link key={link.name} href={link.path}
            className={`flex items-center px-4 py-3  hover:bg-blue-200 ${isActive(link.path) ? 'bg-blue-300' : ''}`}
          >
            {/* Show the name only if the sidebar is open */}
            <span className={`${isOpen ? 'block' : 'hidden'}`}>{link.name}</span>
          </Link>
        ))}
      </nav>
      <Button onClick={handleLogout} className={`${isOpen ? 'block' : 'hidden'}`}>Logout</Button>
    </div>
  );
};

export default AdminSidebar;
