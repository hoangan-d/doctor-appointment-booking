'use client'
import { AdminContext } from '@/app/context/AdminContext'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const DoctorList = () => {

    const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)
    const router = useRouter();

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])



    useEffect(() => {
        const token = localStorage.getItem("aToken");

        if (!token) {
            // If no token, redirect to login page
            router.push("/adminLogin");
        }
    }, [router]);



    return (
        <div className=' w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
            {
                doctors.map((items, index) => (
                    <div key={index}
                        className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group'
                    >
                        <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={items.image} alt='' />
                        <div className='p-4'>
                            <p className='text-neutral-900 text-lg font-medium'>{items.name}</p>
                            <p className='text-zinc-600 text-sm'>{items.specialty}</p>
                            <div className='mt-2 flex items-center gap-1 text-sm'>
                                <input onChange={() => changeAvailability(items._id)} type='checkbox' checked={items.available} />
                                <p>Available</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>

    )
}

export default DoctorList