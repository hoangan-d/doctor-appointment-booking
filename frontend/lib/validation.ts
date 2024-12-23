import { z } from "zod"

export const registerFormSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }).max(100),
    confirmPassword: z.string().min(8, {
        message: "Pasword must be at least 8 characters.",
    }).max(100)
})
    .strict()
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords do not match',
                path: ['confirmPassword']

            });
        }
    })

export const loginFormSchema = z.object({

    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }).max(100),
})
    .strict()

export const addDoctorFormSchema = z.object({
    image: z
        .instanceof(File, { message: "Invalid file type" })
        .refine(
            (file) => ["image/jpeg", "image/png"].includes(file.type),
            { message: "Only JPEG and PNG files are allowed" }
        )
        .refine((file) => file.size <= 5 * 1024 * 1024, { // 5MB limit
            message: "File size must be less than 5MB",
        }),
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }).max(100),
    fees: z.coerce.number().min(0, { message: "Fees must be a positive number" }),
    specialty: z.string().min(1, { message: "Specialty is required" }),
    degree: z.string().min(1, { message: "Degree is required" }),
    experience: z.string().min(1, { message: "Experience is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    about: z.string().min(1, { message: "Bio is required" }),
})
    .strict()
