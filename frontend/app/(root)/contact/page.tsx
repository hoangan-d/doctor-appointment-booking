import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const Contact = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 '>
                <p >CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
            </div>

            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 md-28 text-sm'>
                <Image src='/assets_frontend/contact_image.png' alt='' width={500} height={500} />

                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-semibold text-lg text-gray-600'>Our Office</p>
                    <p>54709 Willms Station <br /> Suite 350, Washington, USA</p>
                    <p>Tel: (+84) 123 456 789 <br />Email: contact@healthspot.com</p>
                    <p className='font-semibold text-lg text-gray-600'>Careers at Healthspot</p>
                    <p>Lear more about our teams and job openings.</p>
                    <Button>Explore Jobs</Button>
                </div>
            </div>
        </div>
    )
}

export default Contact