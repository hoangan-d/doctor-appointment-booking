'use client'
import { AdminContext } from '@/app/context/AdminContext'
import { PanelContext } from '@/app/context/PanelContext'
import { CircleX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const AllApointments = () => {
    const router = useRouter()

    const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
    const { calculateAge } = useContext(PanelContext)

    useEffect(() => {
        if (aToken) {
            getAllAppointments()
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
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointments</p>
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-auto'>
                <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fees</p>
                    <p>Actions</p>
                </div>

                {appointments.map((item, index) => (
                    <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 hover:bg-gray-50' key={index}>
                        <p className='max-sm:hidden'>{index + 1}</p>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 h-8 rounded-full' src={(typeof item.userData.image === 'string' ? item.userData.image : '/guest.png')||'/guest.png'} alt="User image" />
                            <p>{item.userData.name}</p>
                        </div>
                        <p className='max-sm:hidden'>{String(calculateAge(item.userData.dob))}</p>
                        <p className=''>{item.slotDate}, {item.slotTime}</p>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 h-8 rounded-full bg-gray-200' src={(typeof item.docData.image === 'string' ? item.docData.image : '/guest.png')} alt="User image" />
                            <p>{item.docData.name}</p>
                        </div>
                        <p>$ {item.amount}</p>
                        {item.isCompleted
                            ? <p className='text-green-400 text-xs font-medium'> Completed</p>
                            :
                            item.cancelled
                                ?
                                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                                :
                                <CircleX onClick={() => cancelAppointment(item._id)} stroke="#e11432" className='cursor-pointer' />
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllApointments
