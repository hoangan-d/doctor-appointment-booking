'use client'
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

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
    available: boolean;
}

// Define the shape of userData
interface UserData {
    name: string;
    email: string;
    image?: File;
    phone: string;
    addres: string;
    dob: string;
    gender: string;
    [key: string]: any;
}

interface AppContextProps {
    doctors: Doctor[];
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    backendUrl: string,
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
    loadUserProfileData: () => Promise<void>;
    getAllDoctorsData: () => Promise<void>;
}

export const AppContext = createContext<AppContextProps>(null!);

interface AppContextProviderProps {
    children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = (props) => {

    const { toast } = useToast();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState<string | null>(null)
    const [userData, setUserData] = useState<UserData>(null!);

    useEffect(() => {
        // Safely access localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const getAllDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

            if (data.success) {
                setDoctors(data.doctors);
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

    useEffect(() => {
        getAllDoctorsData()
    }, [])

    // Function to load user profile data
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: { token },
            });

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Something went wrong. Please try again.",
                    variant: "destructive",
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

    // Load user profile data on component mount if token exists
    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(null!);
        }
    }, [token, backendUrl]);

    const value: AppContextProps = {
        doctors, getAllDoctorsData,
        token, setToken, backendUrl,
        userData, setUserData, loadUserProfileData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
