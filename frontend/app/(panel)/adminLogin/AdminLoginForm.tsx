"use client"
import React, { useContext } from 'react'
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AdminContext } from '@/app/context/AdminContext'
import { loginFormSchema } from '@/lib/validation'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'




const AdminLoginForm = () => {

    const router = useRouter()
    const { toast } = useToast()

    const { setAToken, backendUrl } = useContext(AdminContext)

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
            const { data } = await axios.post(`${backendUrl}/api/admin/login`, values);

            if (data.success) {
                localStorage.setItem("aToken", data.token); // Save to localStorage
                setAToken(data.token); // Update token in AdminContext
                router.push('/admin')

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


        // console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-0 mt-6 space-y-4 sm:p-6 lg:p-8">
                <p className="text-center text-lg font-medium">Log in to your Admin account</p>

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

export default AdminLoginForm