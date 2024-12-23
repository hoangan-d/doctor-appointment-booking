'use client'

import { AppContext } from '@/app/context/AppContext'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

interface Doctor {
    _id: string;
    name: string;
    email?: string;
    specialty: string;
    degree?: string;
    experience?: number;
    about?: string;
    fees?: number;
    address: string;
    image: string;
    available?: boolean;
}

interface Appointment {
    _id: string;
    userId: string;
    doctorId: string;
    docData: Doctor;
    slotDate: string;
    slotTime: string;
    amount: number;
    date: string;
    cancelled: boolean;
    isCompleted: boolean;
}

const MyAppointment = () => {
    const router = useRouter()
    const { toast } = useToast()
    const { backendUrl, token } = useContext(AppContext)

    const [appointments, setAppointments] = useState<Appointment[]>([])

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
                headers: { token }
            })

            if (data.success) {
                setAppointments(data.appointments.reverse())
                console.log(data.appointments)

            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch appointments. Please try again.',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || 'An error occurred. Please try again.'
                : 'An unexpected error occurred. Please try again.'
            console.error('Error details:', error)

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    useEffect(() => {
        if (!token) {
            router.push("/"); // Redirect to login if not authenticated
        }
    }, [token, router]);


    // Cancel Appointment as User
    const cancelAppointment = async (appointmentId: string) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, {
                headers: { token }
            })
            if (data.success) {
                toast({
                    title: 'Appointment Cancelled',
                    description: data.message || 'Appointment canceled successfully'
                })
                getUserAppointments()
            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Appointment was cancelled unsuccessfully',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || 'An error occurred. Please try again.'
                : 'An unexpected error occurred. Please try again.'
            console.error('Error details:', error)

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        }
    }

    return (
        <div>
            <p className="py-3 mt-12 font-medium border-b">My Appointments</p>
            <div>
                {appointments.length > 0 ? (
                    appointments.map((item, index) => (
                        <div
                            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
                            key={item._id}
                        >
                            <div>
                                <img
                                    src={item.docData?.image || '/placeholder-image.jpg'}
                                    alt={item.docData?.name || 'Doctor Image'}
                                    height={200}
                                    width={200}
                                    className="rounded-md"
                                />
                            </div>
                            <div className="flex-1 text-sm">
                                <p className="text-neutral-800 font-semibold">
                                    {item.docData?.name || 'Unknown Doctor'}
                                </p>
                                <p>{item.docData?.specialty || 'Specialty not available'}</p>
                                <p className="text-zinc-700 font-medium mt-1">About:</p>
                                <p className="text-xs w-1/2">{item.docData?.about || 'No address available'}</p>
                                <p className="text-xs mt-1">
                                    <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{' '}
                                    {item.slotDate} | {item.slotTime}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 justify-end">
                                {item.isCompleted
                                    ?
                                    <Button disabled className='bg-secondary text-green-500'>
                                        Appointment Completed
                                    </Button>
                                    :
                                    item.cancelled
                                        ?
                                        <Button disabled className='bg-secondary text-destructive'>
                                            Appointment Cancelled
                                        </Button>
                                        :
                                        <Button
                                            onClick={() => cancelAppointment(item._id)}
                                            variant="destructive"
                                        >
                                            Cancel Appointment
                                        </Button>
                                }
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-gray-500 mt-6">
                        You have no appointments at the moment.
                    </p>
                )}
            </div>
        </div>
    )
}

export default MyAppointment
