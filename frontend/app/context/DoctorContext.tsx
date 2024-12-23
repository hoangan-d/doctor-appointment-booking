'use client'
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

// Define the doctor type
interface Doctor {
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


// Define the user type
interface User {
    name: string;
    email: string;
    image?: File;
    phone: string;
    addres: string;
    dob: string;
    gender: string;
    [key: string]: any;
}

// Define the appointment type
interface Appointment {
    _id: string;
    userId: string;
    docId: string;
    slotDate: string;
    slotTime: string;
    userData: User;
    docData: Doctor;
    amount: number;
    date: number;
    cancelled: boolean;
    payment: boolean;
    isCompleted: boolean;
}

// Define the Dashboard Data type
interface DashData {
    earnings: number;
    appointments: number;
    patients: number;
    latestAppointments: any[];
}

interface DoctorContextProps {
    dToken: string | null;
    setDToken: React.Dispatch<React.SetStateAction<string | null>>;
    backendUrl: string;
    appointments: Appointment[];
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    getAppointments: () => Promise<void>;
    calculateAge: (dob: string) => number;
    completeAppointment: (appointmentId: string) => Promise<void>;
    cancelAppointment: (appointmentId: string) => Promise<void>;
    dashData: DashData | null;
    setDashData: React.Dispatch<React.SetStateAction<DashData | null>>;
    getDashData: () => Promise<void>;
    profileData: Doctor;
    setProfileData: React.Dispatch<React.SetStateAction<Doctor>>;
    getProfileData: () => Promise<void>;

}

export const DoctorContext = createContext<DoctorContextProps>(null!);

interface DoctorContextProviderProps {
    children: ReactNode;
}

const DoctorContextProvider: React.FC<DoctorContextProviderProps> = (props) => {
    const { toast } = useToast();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
    const [dToken, setDToken] = useState<string | null>(null)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [dashData, setDashData] = useState<DashData | null>(null);
    const [profileData, setProfileData] = useState<Doctor>(null!)


    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`,
                { headers: { dToken } }
            );

            if (data.success) {
                setAppointments(data.appointments.reverse());
                console.log(data.appointments.reverse());

            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Something went wrong. Please try again.',
                    variant: 'destructive',
                });
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

    const calculateAge = (dob: string) => {
        const today = new Date()
        const birtDate = new Date(dob)

        let age = today.getFullYear() - birtDate.getFullYear()
        return age;
    }

    // Complete Appointment
    const completeAppointment = async (appointmentId: string) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId }, {
                headers: { dToken }
            })
            if (data.success) {
                toast({
                    title: 'Appointment Completed',
                    description: data.message || 'Appointment completed successfully'
                })
                getAppointments()
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

    // Cancel Appointment
    const cancelAppointment = async (appointmentId: string) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId }, {
                headers: { dToken }
            })
            if (data.success) {
                toast({
                    title: 'Appointment Cancelled',
                    description: data.message || 'Appointment canceled successfully'
                })
                getAppointments()
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

    //get Dashboard data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`,
                {
                    headers: { dToken, },
                }
            );
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Something went wrong.',
                    variant: 'destructive',
                });
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
    };

    // Get profile data
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`,
                {
                    headers: { dToken }
                }
            );

            if (data.success) {
                setProfileData(data.profileData);
                console.log(data.profileData);

            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Something went wrong. Please try again.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || 'An error occurred. Please try again.'
                : 'An unexpected error occurred. Please try again.'
            // console.error('Error details:', error)

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        }
    }

    // Load token from localStorage after the component is mounted
    useEffect(() => {
        const storedToken = localStorage.getItem('dToken');
        if (storedToken) {
            setDToken(storedToken);
        }
    }, []);

    const value: DoctorContextProps = {
        dToken,
        setDToken,
        backendUrl,
        appointments,
        setAppointments,
        getAppointments,
        calculateAge,
        completeAppointment,
        cancelAppointment,
        dashData,
        setDashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData,
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
