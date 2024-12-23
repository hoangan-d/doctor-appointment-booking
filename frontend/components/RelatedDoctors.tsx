import { AppContext } from '@/app/context/AppContext'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface doctors {
    _id: string;
    name: string;
    email: string;
    specialty: string;
    degree: string;
    experience: number;
    about: string;
    fees: number;
    address: string;
    image: string;
    date: string;
    available: boolean
}

const RelatedDoctors = ({ specialty, docId }: any) => {
    const router = useRouter()

    const { doctors } = useContext(AppContext)

    const [relDocs, serRelDocs] = useState<doctors[]>([])

    useEffect(() => {
        if (doctors.length && specialty) {
            const doctorsData = doctors.filter((doc) => doc.specialty === specialty && doc._id !== docId)
            serRelDocs(doctorsData)
        }
    }, [doctors, specialty, docId])

    const handleDoctorSelect = (doctorId: string) => {
        router.push(`/appointment/${doctorId}`);
    };
    return (
        <div className='flex flex-col items-center gap-4 my-16 text-second-foreground md:mx-10'>
            <h1 className="text-2xl font-bold sm:text-3xl">Related Doctors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relDocs.slice(0, 5).map((doctors) => (
                    <div key={doctors._id} onClick={() => handleDoctorSelect(doctors._id)} className='border border-blue-200 rounded-x1 overflow-hidden cursor-pointer hover:translate-y-[-10px] translate-all duration-500'>
                        <img className='bg-blue-50' src={doctors.image} alt='' />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${doctors.available ? 'text-green-500' : 'text-gray-500'} `}>
                                <p className={`w-2 h-2 ${doctors.available ? `bg-green-500` : `bg-gray-500`}  rounded-full`}></p><p>{doctors.available ? 'Available' : 'Not Available'}</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{doctors.name}</p>
                            <p className='text-gray-600 text-sm'>{doctors.specialty}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Button onClick={() => router.push(`/doctors`)} variant='secondary'>More</Button>
        </div>
    )
}

export default RelatedDoctors