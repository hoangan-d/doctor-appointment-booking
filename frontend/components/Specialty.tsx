import { specialityData } from '@/public/assets_frontend/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Speciality = () => {
    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 '>
            <h1 className="text-2xl font-bold sm:text-3xl"> Find by Specialty</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free</p>
            <div className='flex sm:justify-center overflow-auto gap-4 pt-5 w-full'>
                {specialityData.map((item, index) => (
                    <Link className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 ' key={index} href={`/doctors/${item.specialty}`}>
                        <Image className='w-16 sm:w-24 mb-2' src={item.image} alt='' />
                        <p>{item.specialty}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Speciality