'use client'
import { AdminContext } from '@/app/context/AdminContext'
import { CircleX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const Dashboard = () => {
    const router = useRouter()

    const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getDashData()
        }
    }, [aToken])

    useEffect(() => {
        const token = localStorage.getItem("aToken");

        if (!token) {
            // If no token, redirect to login page
            router.push("/adminLogin");
        }
    }, [router]);

    return dashData && (
        <div className='m-5'>
            <div className='flex flex-wrap gap-3'>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded 
                                border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src="/assets_admin/doctor_icon.svg" alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
                        <p className='text-gray-400'>Doctors</p>
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
                                <img src={item.docData.image} alt="" className='rounded-full w-10 h-10' />
                                <div className='flex-1 text-sm'>
                                    <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                                    <p className='text-gray-600'>{item.slotDate}</p>

                                </div>
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
                        ))
                    }
                </div>
            </div>


        </div>
    )
}

export default Dashboard