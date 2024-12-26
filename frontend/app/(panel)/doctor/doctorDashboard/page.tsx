'use client'
import { DoctorContext } from '@/app/context/DoctorContext'
import { CircleCheck, CircleX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const Dashboard = () => {
    const router = useRouter()

    const { dToken, getDashData, cancelAppointment, completeAppointment, dashData } = useContext(DoctorContext)

    useEffect(() => {
        if (dToken) {
            getDashData()
        }
    }, [dToken])

    useEffect(() => {
        const token = localStorage.getItem("dToken");

        if (!token) {
            // If no token, redirect to login page
            router.push("/doctorLogin");
        }
    }, [router]);

    return dashData && (
        <div className='m-5'>
            <div className='flex flex-wrap gap-3'>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded 
                                border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src="/assets_admin/earning_icon.svg" alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>$ {dashData.earnings}</p>
                        <p className='text-gray-400'>Earnings</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded 
                                border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src="/assets_admin/appointments_icon.svg" alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
                        <p className='text-gray-400'>Appointments</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded 
                                border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src="/assets_admin/patients_icon.svg" alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
                        <p className='text-gray-400'>Patients</p>
                    </div>
                </div>

            </div>

            <div className='bg-white'>
                <div className='flex items-center gap-2.5 p-4 mt-10 rounded-t border'>
                    <img src="/assets_admin/list_icon.svg" alt="" />
                    <p className='font-semibold'>Latest Booking</p>
                </div>

                <div className="pt-4 border border-t-0">
                    {
                        dashData.latestAppointments.map((item, index) => (
                            <div key={index} className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100'>
                                <img src={item.userData.image ||'/guest.png'} alt="" className='rounded-full w-10 h-10' />
                                <div className='flex-1 text-sm'>
                                    <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                                    <p className='text-gray-600'>{item.slotDate}</p>

                                </div>
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


        </div>
    )
}

export default Dashboard
