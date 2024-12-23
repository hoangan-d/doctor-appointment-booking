'use client'
import { DoctorContext } from '@/app/context/DoctorContext'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const DoctorProfile = () => {
    const router = useRouter()
    const { toast } = useToast();

    const { dToken, backendUrl, profileData, setProfileData, getProfileData } = useContext(DoctorContext)

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }

    }, [dToken]);

    useEffect(() => {
        const token = localStorage.getItem("dToken");

        if (!token) {
            // If no token, redirect to login page
            router.push("/doctorLogin");
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Type narrow for checkbox
        const newValue = type === 'checkbox' && e.target instanceof HTMLInputElement
            ? e.target.checked
            : value;

        setProfileData({
            ...profileData,
            [name]: newValue,
        });
    };


    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                available: profileData.available
            }

            const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData,
                {
                    headers: { dToken, },
                }
            );

            if (data.success) {
                toast({
                    title: "Change Successful",
                    description: "The doctor data has been successfully updated..",
                });
                getProfileData()
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
    }

    return profileData && (
        <div className="max-w-4xl mx-auto mt-10 p-5 shadow-lg rounded-lg bg-white">
            {/* Top Section: Doctor Image and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Doctor Image */}
                <div className="flex-shrink-0">
                    <img
                        src={profileData.image}
                        alt={profileData.name}
                        className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                </div>

                {/* Doctor Details */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{profileData.degree} - {profileData.specialty}</p>
                        <p className="mt-2 text-sm text-gray-700">
                            <span className="font-semibold">Experience:</span> {profileData.experience}
                        </p>
                    </div>
                    <div>
                        <p className="mt-3 text-gray-600">{profileData.about}</p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <hr className="my-6" />

            {/* Bottom Section: Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">Address</h3>
                    <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md text-sm text-gray-600"
                    />
                </div>

                {/* Fees */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">Consultation Fees</h3>
                    <input
                        type="number"
                        name="fees"
                        value={profileData.fees}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md text-sm text-gray-600"
                        min="0"
                    />
                </div>

                {/* Availability Checkbox */}
                <div className="col-span-2 flex items-center gap-3 mt-4">
                    <input
                        type="checkbox"
                        name="available"
                        checked={profileData.available}
                        onChange={handleChange}
                        className="w-5 h-5 accent-green-500"
                    />
                    <label htmlFor="availability" className="text-sm font-semibold text-gray-700">
                        Available for Appointments
                    </label>
                </div>
            </div>
            {/* Save Button */}
            <div className="mt-6 text-right">
                <Button
                    onClick={updateProfile}
                    className="px-5 py-2 "
                >
                    Save Changes
                </Button>
            </div>
        </div>
    )
}

export default DoctorProfile