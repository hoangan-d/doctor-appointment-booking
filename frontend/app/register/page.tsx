import React from 'react'
import Image from 'next/image'
import RegisterForm from './RegisterForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Register = () => {
    return (
        <section className=" mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className='mx-auto rounded-lg p-4 shadow-lg max-w-lg'>
                <div className='flex justify-center'>
                    <Image
                        src="/healthspot-logo.png"
                        height={500}
                        width={300}
                        alt='healthspot'
                        priority
                        className='mb-12 h-10 w-fit'
                    />
                </div>

                <h1 className='text-center text-2xl font-bold text-primary sm:text-3xl'>Join Us Now! </h1>
                <p className='mx-auto mt-4 max-w-md text-center text-gray-500'>Register with your personal details to use all of site features.</p>
                <RegisterForm />

                <p className="text-center text-sm text-gray-500">
                    Already have an account?
                    <Button variant="link">
                        <Link href="/login">Sign in</Link>
                    </Button>
                </p>

            </div>
        </section>

    )
}

export default Register