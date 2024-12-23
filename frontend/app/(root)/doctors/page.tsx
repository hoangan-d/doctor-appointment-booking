'use client'
import { AppContext } from '@/app/context/AppContext'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Doctors = () => {
    const router = useRouter()
    const [specialty, setSpecialty] = useState<string | undefined>(undefined);

    const { doctors } = useContext(AppContext)
    const [filterDoc, setFilterDoc] = useState(doctors)

    const applyFilter = () => {
        if (specialty) {
            setFilterDoc(doctors.filter(doc => doc.specialty === specialty))
        } else {
            setFilterDoc(doctors);
        }
    }
    useEffect(() => {
        applyFilter()
    }, [doctors, specialty])

    const handleSpecialityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSpecialty(event.target.value);
        applyFilter();
    };
    return (
        <div>
            <h1 className="text-2xl font-bold sm:text-3xl text-center">Doctor List</h1>

            {/* Dropdown to select specialty */}
            <label htmlFor="specialty">Filter by Specialty: </label>
            <select id="specialty" onChange={handleSpecialityChange} value={specialty || ''} className='border border-gray-300 m-4'>
                <option value="">All Specialties</option>
                {/* Assuming the doctors array has unique specialities */}
                {[...new Set(doctors.map((doc) => doc.specialty))].map((specialty) => (
                    <option key={specialty} value={specialty}>
                        {specialty}
                    </option>
                ))}
            </select>

            {/* List of doctors */}
            <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                {
                    filterDoc.map((doctors) => (
                        <div key={doctors._id} onClick={() => router.push(`/appointment/${doctors._id}`)} className='border border-blue-200 rounded-x1 overflow-hidden cursor-pointer hover:translate-y-[-10px] translate-all duration-500'>
                            <img className='bg-blue-50' src={doctors.image} alt='' />
                            <div className='p-4'>
                                <div className={`flex items-center gap-2 text-sm text-center ${doctors.available ? 'text-green-500' : 'text-gray-500'} `}>
                                    <p className={`w-2 h-2 ${doctors.available ? `bg-green-500` : `bg-gray-500`}  rounded-full`}></p><p>{doctors.available ? 'Available' : 'Not Available'}</p>
                                </div>
                                <p className='text-gray-900 text-lg font-medium'>{doctors.name}</p>
                                <p className='text-gray-600 text-sm'>{doctors.specialty}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Doctors