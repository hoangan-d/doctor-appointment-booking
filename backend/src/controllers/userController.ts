import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import userModel from "../models/userModel";
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel";
import appointmentModel from "../models/appointmentModel";



interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

// API to register user
const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;


        // Validate email format
        if (!validator.isEmail(email)) {
            res.status(400).json({ success: false, message: "Enter a valid email" });
            return;
        }

        // Validate password length
        if (password.length < 8) {
            res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user data
        const userData = {
            name,
            email,
            password: hashedPassword,
        };

        // Save the user to the database
        const newUser = new userModel(userData);
        const user = await newUser.save();

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        // Send success response with token
        res.json({ success: true, token });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

//API for user login
const loginUser = async (req: LoginRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required." });
            return;
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User does not exist." });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string,);
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials." });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API to get user profile data
const getProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body

        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API to update user profile
const updateProfile = async (req: Request, res: Response) => {
    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            res.json({ success: false, message: "Data Nissing" })
            return;
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address, dob, gender })

        if (imageFile) {
            // Up load image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageUrl })
        }
        res.json({ success: true, message: "Profile Updated" })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

//API to book appointment
const bookAppointment = async (req: Request, res: Response) => {
    try {

        const { userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData) {
            res.status(404).json({ success: false, message: "Doctor not found" });
            return;
        }

        if (!docData.available) {
            res.json({ success: false, message: "Doctor not available" });
            return;
        }
        let slotsBooked = docData.slotsBooked || {}

        // Check for slot availability

        if (slotsBooked[slotDate]) {
            if (slotsBooked[slotDate].includes(slotTime)) {
                res.json({ success: false, message: "Slot not available" })
                return;
            } else {
                slotsBooked[slotDate].push(slotTime)
            }
            console.log('After booking:', slotsBooked);
        } else {
            slotsBooked[slotDate] = []
            slotsBooked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slotsBooked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // Save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slotsBooked })

        res.json({ success: true, message: "Appointment Booked" })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

// API to get user appointments for frontend myappointment page
const listAppointment = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

// API to cancel appoinment
const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const { userId, appointmentId } = req.body


        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            res.status(404).json({ success: false, message: "Appointment not found" });
            return;
        }

        if (!appointmentData.userId) {
            res.json({ success: false, message: "Appointment not available" });
            return;
        }

        // Verify appointment user
        if (appointmentData.userId !== userId) {
            res.json({ success: false, message: 'Unauthorized action' })
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

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
};