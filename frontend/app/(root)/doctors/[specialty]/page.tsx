'use client'
import { useParams, useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { AppContext } from '@/app/context/AppContext';
import { Button } from '@/components/ui/button';


const SpecialtyPage = () => {
    const router = useRouter()

    const params = useParams();
    const specialty = params.specialty// Get the specialty from the URL
    const { doctors } = useContext(AppContext) // Ensure context is typed

    // Filter doctors by specialty
    const filteredDoctors = doctors.filter((doctor) => doctor.specialty === specialty);

    const handleDoctorSelect = (doctorId: string) => {
        router.push(`/appointment/${doctorId}`);
    };

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-second-foreground md:mx-10'>
            <h1 className="text-2xl font-bold sm:text-3xl">Doctors Specializing in {specialty}</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            {filteredDoctors.length > 0 ? (
                <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor._id} onClick={() => handleDoctorSelect(doctor._id)} className='border border-blue-200 rounded-x1 overflow-hidden cursor-pointer hover:translate-y-[-10px] translate-all duration-500'>
                            <img className='bg-blue-50' src={doctor.image} alt='' />
                            <div className='p-4'>
                                <div className={`flex items-center gap-2 text-sm text-center ${doctor.available ? 'text-green-500' : 'text-gray-500'} `}>
                                    <p className={`w-2 h-2 ${doctor.available ? `bg-green-500` : `bg-gray-500`}  rounded-full`}></p><p>{doctor.available ? 'Available' : 'Not Available'}</p>
                                </div>
                                <p className='text-gray-900 text-lg font-medium'>{doctor.name}</p>
                                <p className='text-gray-600 text-sm'>{doctor.specialty}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No doctors available for this specialty.</p>
            )}
            <Button onClick={() => router.push(`/doctors`)} variant='secondary'>More</Button>
        </div>
    );
};

export default SpecialtyPage;
