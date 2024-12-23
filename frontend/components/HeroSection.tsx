import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const HeroSection = () => {
    return (
        <section id='MainContent'>
            <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:h-screen lg:grid-cols-2">
                    <div className="relative z-10 lg:py-16">
                        <div className="relative h-64 sm:h-80 lg:h-full">
                            <Image
                                alt=""
                                src="/Doctors.png"
                                width={1000}
                                height={1000}
                                priority
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="relative flex items-center bg-gray-100">
                        <span
                            className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-gray-100"
                        ></span>

                        <div className="p-8 sm:p-16 lg:p-24">
                            <h2 className="text-2xl font-bold sm:text-3xl">
                                Book Appointment with Trusted Doctors
                            </h2>

                            <p className="mt-4 text-gray-600">
                                We are committed to providing you with the most convenient and efficient calendar-setting experience.
                                Let us help you take care of your health more easily!
                            </p>

                            <Button className='mt-8 inline-block' asChild>
                                <Link href="#speciality">Get started</Link>
                            </Button>


                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default HeroSection