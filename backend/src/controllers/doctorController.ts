

import { Request, Response } from "express";
import doctorModel from "../models/doctorModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel";



interface ChangeAvailabilityRequest extends Request {
    body: {
        docId: string;
    };
}

const changeAvailability = async (req: ChangeAvailabilityRequest, res: Response): Promise<void> => {
    try {
        const { docId } = req.body;

        if (!docId) {
            res.status(400).json({ success: false, message: "Doctor ID is required" });
            return;
        }

        const docData = await doctorModel.findById(docId);
        if (!docData) {
            res.status(404).json({ success: false, message: "Doctor not found" });
            return;
        }

        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: "Availability Changed" });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

const doctorList = async (req: Request, res: Response) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({ success: true, doctors })
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
const bookedSlots = async (req: Request, res: Response) => {
    const { docId } = req.params;

    try {
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.json({ success: true, slotsBooked: doctor.slotsBooked || {} });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API for doctor login
const loginDcotor = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            res.json({ success: false, message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET as string,);
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

//API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req: Request, res: Response) => {

    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API to mark appointment completed for doctor panel
const appointmentsComplete = async (req: Request, res: Response) => {

    try {

        const { docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            res.status(404).json({ success: false, message: "Appointment not found" });
            return;
        }

        if (!appointmentData.docId) {
            res.json({ success: false, message: "Appointment not available" });
            return;
        }

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            res.json({ success: true, message: 'Appointment Completed' })
            return;
        } else {
            res.json({ success: false, message: 'Mark Failed' })
            return;
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API to cancel appointment completed for doctor panel
const appointmentsCancel = async (req: Request, res: Response) => {

    try {

        const { docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            res.status(404).json({ success: false, message: "Appointment not found" });
            return;
        }

        if (!appointmentData.docId) {
            res.json({ success: false, message: "Appointment not available" });
            return;
        }

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            res.json({ success: true, message: 'Appointment Cancelled' })
            return;
        } else {
            res.json({ success: false, message: 'Cancellation Failed' })
            return;
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req: Request, res: Response) => {

    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted) {
                earnings += item.amount
            }
        })

        let patients: any[] = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API to get doctor profile
const doctorProfile = async (req: Request, res: Response) => {

    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

// API to update doctor profile data
const updateDoctorProfile = async (req: Request, res: Response) => {

    try {

        const { docId, fees, address, available } = req.body
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

export {
    changeAvailability,
    doctorList,
    bookedSlots,
    loginDcotor,
    appointmentsDoctor,
    appointmentsComplete,
    appointmentsCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
};
