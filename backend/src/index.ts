import express, { Request, Response } from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb';
import connectCloudinary from './config/cloudinary';
import adminRouter from './routes/adminRoute';
import doctorRouter from './routes/doctorRoute';
import userRouter from './routes/userRoute';


// app config
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


// middlewares
app.use(express.json());
app.use(cors())

//api endpoint
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
//localhost:4000/api/admin/add-doctor

app.get('/', (req: Request, res: Response) => {
    res.send('API WORKING great')
})

app.listen(port, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://localhost:${port}`);
});