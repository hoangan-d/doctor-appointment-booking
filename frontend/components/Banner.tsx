import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Link from 'next/link'

const Banner = () => {
    return (
        <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
            {/* left side */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3x1 lg:text-5xl font-semibold text-primary-foreground'>
                    <p>Book Appointment</p>
                    <p className='mt-4'>With 100+ Trusted Doctors</p>
                </div>
                <Button className='text-sm sm:text-base px-8 py-3 mt-6' variant='secondary'><Link href='/register'>Create account</Link> </Button>
            </div>
            {/* right side */}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <Image className='w-full absolute bottom-0 right-0 max-w-md' src='/assets_frontend/appointment_img.png' alt='' width={500} height={500} />
            </div>
        </div>
    )
}

export default Banner