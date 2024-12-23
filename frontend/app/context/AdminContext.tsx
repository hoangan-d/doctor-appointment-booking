'use client';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { createContext, useState, ReactNode, useEffect } from 'react';

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
    doctors: number;
    appointments: number;
    patients: number;
    latestAppointments: any[];
}

// Extend the context's type
interface AdminContextType {
    aToken: string;
    setAToken: React.Dispatch<React.SetStateAction<string>>;
    backendUrl: string;
    doctors: Doctor[];
    getAllDoctors: () => Promise<void>;
    changeAvailability: (docId: string) => Promise<void>;
    appointments: Appointment[];
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    getAllAppointments: () => Promise<void>;
    cancelAppointment: (appointmentId: string) => Promise<void>;
    dashData: DashData | null;
    setDashData: React.Dispatch<React.SetStateAction<DashData | null>>;
    getDashData: () => Promise<void>;
}

// Create the context with a default value
export const AdminContext = createContext<AdminContextType>(null!);

interface AdminContextProviderProps {
    children: ReactNode;
}

const AdminContextProvider: React.FC<AdminContextProviderProps> = ({ children }) => {
    const [aToken, setAToken] = useState<string>('');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [dashData, setDashData] = useState<DashData | null>(null);

    const { toast } = useToast();

    // Access the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

    // Get all doctors
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/all-doctors`, {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        aToken,
                    },
                }
            );

            if (data.success) {
                setDoctors(data.doctors);
                console.log(data.doctors);
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
    };

    // Change doctor's availability
    const changeAvailability = async (docId: string) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId },
                {
                    headers: { aToken, },
                }
            );
            if (data.success) {
                toast({
                    title: "Change Successful",
                    description: "The doctor's availability has been successfully updated..",
                });
            } else {
                toast({
                    title: 'Change Failed',
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
    };

    // Get all appointments
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`,
                {
                    headers: { aToken, },
                }
            );
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
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

    // Cancel Appointment as admin
    const cancelAppointment = async (appointmentId: string) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, {
                headers: { aToken }
            })
            if (data.success) {
                toast({
                    title: 'Appointment Cancelled',
                    description: data.message || 'Appointment canceled successfully'
                })
                getAllAppointments()
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

    // Get dashData
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`,
                {
                    headers: { aToken, },
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

    // Load token from localStorage after the component is mounted
    useEffect(() => {
        const storedToken = localStorage.getItem('aToken');
        if (storedToken) {
            setAToken(storedToken);
        }
    }, []);



    // Combine all values into the context value
    const value: AdminContextType = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        setDashData,
        getDashData,
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContextProvider;
