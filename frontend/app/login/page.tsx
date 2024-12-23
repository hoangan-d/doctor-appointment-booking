import React from 'react'
import Image from 'next/image'
import LoginForm from './LoginForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Login = () => {
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

                <h1 className='text-center text-2xl font-bold text-primary sm:text-3xl'>Wellcome back </h1>
                <LoginForm />
                <p className="text-center text-sm text-gray-500">
                    No account?
                    <Button variant="link">
                        <Link href="/register">Sign up</Link>
                    </Button>
                </p>
                <div className='text-14-regular mt-20 flex justify-between'>
                    <p className='justify-items-end text-gray-600 xl:text-left'>
                        &copy; 2024 Healthspot
                    </p>
                    <Link href="/adminLogin" className='text-blue-500'>
                        Admin
                    </Link>
                </div>
            </div>
        </section>

    )
}

export default Login