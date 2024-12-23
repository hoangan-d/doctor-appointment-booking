"use client"
import React, { useContext, useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { set, z } from "zod"
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
import { addDoctorFormSchema } from '@/lib/validation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AdminContext } from '@/app/context/AdminContext'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'





const AddDoctorForm = () => {

    const router = useRouter()
    const { toast } = useToast()

    const { backendUrl, aToken, setAToken } = useContext(AdminContext)

    const [objectURL, setObjectURL] = useState<string | null>(null);

    const form = useForm<z.infer<typeof addDoctorFormSchema>>({
        resolver: zodResolver(addDoctorFormSchema),
        defaultValues: {
            image: undefined,
            name: "",
            email: "",
            password: "",
            fees: 1,
            specialty: "Select Specialty",
            degree: "",
            experience: "",
            address: "",
            about: "",

        },
    })

    async function onSubmit(values: z.infer<typeof addDoctorFormSchema>) {

        try {
            const formData = new FormData()

            formData.append('image', values.image)
            formData.append('name', values.name)
            formData.append('email', values.email)
            formData.append('password', values.password)
            formData.append('experience', values.experience)
            formData.append('fees', values.fees.toString())
            formData.append('about', values.about)
            formData.append('specialty', values.specialty)
            formData.append('degree', values.degree)
            formData.append('address', values.address)

            formData.forEach((value, key) => {
                console.log(`${key}:${value}`)
            })

            // Send the form data to the backend
            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    aToken, // Pass admin token
                },
            });

            if (data.success) {

                toast({
                    title: "Added Successful",
                    description: "Doctor has been added.",
                });
                form.reset()

            } else {
                toast({
                    title: "Added Failed",
                    description: data.message || "Something went wrong. Please try again.",
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
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file); // Update the form state
            const url = URL.createObjectURL(file); // Generate Object URL
            setObjectURL(url); // Save for preview
        }
    };


    useEffect(() => {
        const token = localStorage.getItem("aToken");

        if (!token) {
            // If no token, redirect to login page
            router.push("/adminLogin");
        }
    }, [router]);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full space-y-4 sm:p-3 lg:p-4">
                <p className="text-center text-lg font-medium">Add Doctor</p>

                <div className='p-4 border rounded w-full max-h-[70vh] overflow-auto'>
                    <div className='flex flex-col lg:flex-row items-start gap-10'>
                        <div className='flex flex-col'>
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Image</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                onChange={(e) => {
                                                    handleFileChange(e);
                                                    field.onChange(e.target.files?.[0]);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* File Preview */}
                            {objectURL && (
                                <div className="mt-4">
                                    <p>Preview:</p>
                                    <img
                                        src={objectURL}
                                        alt="Preview"
                                        className="w-32 h-32 rounded"
                                    />
                                </div>
                            )}
                        </div>



                        <div className='w-full lg:flex-1 flex flex-col gap-4'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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


                            <FormField
                                control={form.control}
                                name="fees"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fees</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123" type='number' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        <div className='w-full lg:flex-1 flex flex-col gap-4'>
                            <FormField
                                control={form.control}
                                name="specialty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specialty</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Specialty" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Psychology">Psychology</SelectItem>
                                                <SelectItem value="Gynecology">Gynecology</SelectItem>
                                                <SelectItem value="Dermatology">Dermatology</SelectItem>
                                                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                                <SelectItem value="Neurology">Neurology</SelectItem>
                                                <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="degree"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Degree</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Degree"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="experience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Experience (years)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="experience" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="about"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>About Doctor</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write about doctor"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <Button className='block w-1/3 text-sm font-medium' type="submit">
                    Add Doctor
                </Button>

            </form>
        </Form>
    )
}

export default AddDoctorForm