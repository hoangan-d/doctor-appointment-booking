'use client'
import { DoctorContext } from '@/app/context/DoctorContext'
import { CircleCheck, CircleX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const DoctorAppointment = () => {

    const router = useRouter()
    const { dToken, appointments, getAppointments, calculateAge, completeAppointment, cancelAppointment } = useContext(DoctorContext)

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    useEffect(() => {
        const token = localStorage.getItem("dToken");

        if (!token) {
            // If no token, redirect to login page
            router.push("/doctorLogin");
        }
    }, [router]);
    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointment</p>

            <div className='bg-white border rounded text-sm max-h-[80vh] overflow-auto'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {
                    appointments.reverse().map((item, index) => (
                        <div key={index} className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base
                                                    sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 
                                                    items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100'>
                            <p className='max-sm:hidden'>{index + 1}</p>
                            <div className='flex items-center gap-2'>
                                <img className='w-8 h-8 rounded-full' src={(typeof item.userData.image === 'string' ? item.userData.image : '/guest.png')||'/guest.png'} alt="User image" />
                            </div>
                            <div>
                                <p className='text-xs inline border border-primary px-2 rounded-full'>
                                    {item.payment ? 'online' : 'Cash'}
                                </p>
                            </div>
                            <p className='max-sm:hidden'>{String(calculateAge(item.userData.dob))}</p>
                            <p>{item.slotDate}, {item.slotTime}</p>
                            <p>$ {item.amount}</p>
                            {
                                item.isCompleted
                                    ? <p className='text-[#23c021] text-xs font-medium'>Completed</p>
                                    : item.cancelled
                                        ? <p className='text-[#e11432] text-xs font-medium'>Canceled</p>
                                        : <div className='flex'>
                                            <CircleCheck onClick={() => completeAppointment(item._id)} stroke="#23c021" className='w-10 cursor-pointer' />
                                            <CircleX onClick={() => cancelAppointment(item._id)} stroke="#e11432" className='w-10 cursor-pointer' />
                                        </div>
                            }

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default DoctorAppointment
