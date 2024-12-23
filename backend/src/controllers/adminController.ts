import validator from "validator"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel"
import jwt from 'jsonwebtoken'
import { Request, Response } from "express";
import appointmentModel from "../models/appointmentModel"
import userModel from "../models/userModel"

//API for adding doctor
const addDoctor = async (req: Request, res: Response) => {
    try {
        const { name, email, password, specialty, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // Check for missing fields
        if (!name || !email || !password || !specialty || !degree || !experience || !about || !fees || !address) {
            res.status(400).json({ success: false, message: "Missing details" });
            return;
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            res.status(400).json({ success: false, message: "Please enter a valid email" });
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            res.status(400).json({ success: false, message: "Please enter a strong password" });
            return;
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Upload image to Cloudinary
        if (!imageFile) {
            res.status(400).json({ success: false, message: "Image file is required" });
            return;
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });
        const imageUrl = imageUpload.secure_url;


        // Create doctor data
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            specialty,
            degree,
            experience,
            about,
            fees,
            address,
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(201).json({ success: true, message: "Doctor added" });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API for admin login
const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
            throw new Error("Server configuration error. Missing environment variables.");
        }

        // Validate admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Create a payload for the token
            const payload = { email, role: "admin" };

            // Generate a JWT token with the payload
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

            res.status(200).json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API to get all doctors list for admin panel
const allDoctors = async (req: Request, res: Response) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req: Request, res: Response) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

// API for appointment cancellation
const appointmentCancel = async (req: Request, res: Response) => {
    try {
        const { appointmentId } = req.body


        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            res.status(404).json({ success: false, message: "Appointment not found" });
            return;
        }


        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // Releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slotsBooked = doctorData.slotsBooked

        slotsBooked[slotDate] = slotsBooked[slotDate].filter((e: any) => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slotsBooked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
// API to get daxhboard data for admin panel
const adminDashboard = async (req: Request, res: Response) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    appointmentCancel,
    adminDashboard,
}