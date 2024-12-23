"use client"
import React, { useContext } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginFormSchema } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { DoctorContext } from '@/app/context/DoctorContext'



const DoctorLoginForm = () => {

    const router = useRouter()
    const { toast } = useToast()

    const { setDToken, backendUrl } = useContext(DoctorContext)

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        try {
            // Send the form data to the backend
            const { data } = await axios.post(`${backendUrl}/api/doctor/login`, values);

            if (data.success) {
                localStorage.setItem("dToken", data.token); // Save to localStorage
                setDToken(data.token); // Update token in AdminContext
                router.push('/doctor')

                toast({
                    title: "Login Successful",
                    description: "You have successfully logged in.",
                });
            } else {
                toast({
                    title: "Login Failed",
                    description: data.message || "Invalid credentials. Please try again.",
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
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-0 mt-6 space-y-4 sm:p-6 lg:p-8">
                <p className="text-center text-lg font-medium">Log in to your Doctor account</p>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" type='email' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="password" type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className='block w-full text-sm font-medium' type="submit">
                    Login
                </Button>

            </form>
        </Form>
    )
}

export default DoctorLoginForm