'use client';

import { AppContext } from '@/app/context/AppContext';
import RelatedDoctors from '@/components/RelatedDoctors';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

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
    available: boolean;
}

interface TimeSlot {
    datetime: Date;
    time: string;
}

const Appointment = () => {
    const { toast } = useToast();
    const router = useRouter();
    const { docId } = useParams();
    const { doctors, backendUrl, token, getAllDoctorsData } = useContext(AppContext);

    const [docInfo, setDocInfo] = useState<Doctor | null>(null);
    const [docSlots, setDocSlots] = useState<TimeSlot[][]>([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const [slotsBooked, setSlotsBooked] = useState<Record<string, string[]>>({});

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    // Fetch doctor information
    useEffect(() => {
        const doctor = doctors.find(doc => doc._id === docId);
        setDocInfo(doctor || null);;
    }, [doctors, docId]);

    // Generate available slots
    useEffect(() => {
        if (!docInfo) return;

        const generateSlots = () => {
            const today = new Date();
            const slots: TimeSlot[][] = [];

            for (let i = 0; i < 7; i++) {
                const dayStart = new Date(today);
                dayStart.setDate(today.getDate() + i);
                dayStart.setHours(i === 0 && today.getHours() >= 10 ? today.getHours() + 1 : 10, 0, 0, 0);

                const dayEnd = new Date(dayStart);
                dayEnd.setHours(21, 0, 0, 0);

                const daySlots: TimeSlot[] = [];
                while (dayStart < dayEnd) {
                    daySlots.push({
                        datetime: new Date(dayStart),
                        time: dayStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    });
                    dayStart.setMinutes(dayStart.getMinutes() + 30);
                }

                slots.push(daySlots);
            }

            setDocSlots(slots);
        };

        generateSlots();
    }, [docInfo]);

    useEffect(() => {
        const fetchBookedSlots = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/doctor/${docId}/booked-slots`);
                setSlotsBooked(data.slotsBooked || {});
            } catch (error) {
                console.error('Failed to fetch booked slots:', error);
            }
        };

        if (docId) fetchBookedSlots();
    }, [docId]);

    // Book an appointment
    const bookAppointment = async () => {
        if (!token) {
            toast({
                title: 'Booking failed',
                description: 'You need to login to book an appointment.',
                variant: 'destructive',
            });
            return router.push('/login');
        }

        try {
            const selectedSlot = docSlots[slotIndex]?.[0]?.datetime;
            if (!selectedSlot) throw new Error('No available slot selected.');

            const slotDate = `${selectedSlot.getDate()}/${selectedSlot.getMonth() + 1}/${selectedSlot.getFullYear()}`;
            console.log(slotDate, slotTime, docId)

            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                { docId, slotDate, slotTime },
                { headers: { token } }
            );

            if (data.success) {
                toast({ title: 'Booking successful', description: 'Your appointment has been booked.' });

                // Update local slotsBooked state
                setSlotsBooked(prev => ({
                    ...prev,
                    [slotDate]: [...(prev[slotDate] || []), slotTime],
                }));

                getAllDoctorsData();
                router.push('/myappointment');
            } else {
                toast({
                    title: 'Booking failed',
                    description: data.message || 'Your appointment booking failed. Try again.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || 'An error occurred. Please try again.'
                : 'An unexpected error occurred. Please try again.';
            console.error('Error details:', error);

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };

    const isSlotBooked = (date: string, time: string) => {
        return slotsBooked[date]?.includes(time) || false;
    };

    return docInfo ? (
        <div>
            {/* Doctor Details */}
            <div className="flex flex-col sm:flex-row gap-4">
                <img
                    className="bg-primary w-full sm:max-w-72 rounded-lg"
                    src={docInfo.image}
                    alt={docInfo.name}
                />

                <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7">
                    <p className="flex items-center gap-2 text-2xl font-medium">
                        {docInfo.name}
                        <img src="/assets_frontend/verified_icon.svg" alt="Verified" width={20} height={20} />
                    </p>

                    <p className="text-sm mt-1">{docInfo.degree} - {docInfo.specialty}</p>

                    <p className="text-sm mt-3 text-gray-500">{docInfo.about}</p>

                    <p className="mt-2">Appointment fee: $ {docInfo.fees}</p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className="mt-4">
                <p>Booking Slots</p>

                <div className="flex gap-3 mt-4 overflow-auto">
                    {docSlots.map((slots, index) => (
                        <div
                            key={index}
                            onClick={() => setSlotIndex(index)}
                            className={`py-6 min-w-16 text-center rounded-md cursor-pointer ${slotIndex === index ? 'bg-primary text-primary-foreground' : 'border border-gray-200'
                                }`}
                        >
                            <p>{slots[0]?.datetime && daysOfWeek[slots[0].datetime.getDay()]}</p>
                            <p>{slots[0]?.datetime && slots[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 mt-4 overflow-auto">
                    {docSlots[slotIndex]?.map((slot, index) => {
                        const slotDate = `${slot.datetime.getDate()}/${slot.datetime.getMonth() + 1}/${slot.datetime.getFullYear()}`;
                        const booked = isSlotBooked(slotDate, slot.time);

                        return (
                            <p
                                key={index}
                                onClick={() => !booked && setSlotTime(slot.time)}
                                className={`px-5 py-2 min-w-28 text-sm font-light rounded-md cursor-pointer ${booked
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : slot.time === slotTime
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-gray-400 border border-gray-300'
                                    }`}
                            >
                                {slot.time.toLowerCase()}
                            </p>
                        );
                    })}
                </div>
                <Button onClick={bookAppointment} className="my-6">
                    Book an Appointment
                </Button>
            </div>

            <RelatedDoctors docId={docId} specialty={docInfo.specialty} />
        </div>
    ) : null;
};

export default Appointment;
