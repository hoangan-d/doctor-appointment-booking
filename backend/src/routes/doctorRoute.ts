import express from "express";
import {
    doctorList,
    bookedSlots,
    loginDcotor,
    appointmentsDoctor,
    appointmentsComplete,
    appointmentsCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
} from "../controllers/doctorController";
import authDoctor from "../middlewares/authDoctor";

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)

doctorRouter.get(`/:docId/booked-slots`, bookedSlots)

doctorRouter.post('/login', loginDcotor)

doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentsComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentsCancel)

doctorRouter.get('/dashboard', authDoctor, doctorDashboard)

doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)



export default doctorRouter