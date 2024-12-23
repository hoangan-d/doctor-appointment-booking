"use client"
import React, { useContext, useEffect } from 'react'
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
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'


const LoginForm = () => {

    const router = useRouter()
    const { toast } = useToast()
    const { backendUrl, token, setToken } = useContext(AppContext)

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
            const { data } = await axios.post(`${backendUrl}/api/user/login`, values);

            if (data.success) {
                localStorage.setItem("token", data.token); // Save to localStorage
                setToken(data.token); // Update token in AdminContext


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
            if (axios.isAxiosError(error)) {
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "An error occurred. Please try again.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Unexpected Error",
                    description: "An unexpected error occurred. Please try again.",
                    variant: "destructive",
                });
            }
        }
    }

    useEffect(() => {
        if (token) {
            router.push('/')
        }
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-0 mt-6 space-y-4 sm:p-6 lg:p-8">
                <p className="text-center text-lg font-medium">Log in to your account</p>

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

export default LoginForm