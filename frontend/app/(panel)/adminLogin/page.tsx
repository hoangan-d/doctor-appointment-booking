import React from 'react'
import Image from 'next/image'
import AdminLoginForm from './AdminLoginForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Login = () => {
    return (
        <section className=" mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className='mx-auto rounded-lg p-4 shadow-lg max-w-lg'>
                <div className='flex justify-center'>
                    <Link className="block text-primary" href="/">
                        <span className="sr-only">Home</span>
                        <Image
                            src="/healthspot-logo.png"
                            height={500}
                            width={300}
                            alt='healthspot'
                            priority
                            className='mb-12 h-10 w-fit'
                        />
                    </Link>

                </div>

                <h1 className='text-center text-2xl font-bold text-primary sm:text-3xl'>Admin Panel </h1>
                <AdminLoginForm />
                <p className="text-center text-sm text-gray-500">
                    Login as Doctor?
                    <Button variant="link">
                        <Link href="/doctorLogin">Click here</Link>
                    </Button>
                </p>
            </div>
        </section>

    )
}

export default Login