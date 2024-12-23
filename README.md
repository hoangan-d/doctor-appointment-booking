Environment Setup:

Install Node.js and npm for backend development.

Install MongoDB Atlas and set up a cluster for the database.

Clone the repository from GitHub and run npm install to install dependencies.

Configure the .env file with necessary environment variables (e.g., database URI, Cloudinary keys, email credentials).

backend/.env
```bash
MONGODB_URI = ''
CLOUDINARY_NAME = ''
CLOUDINARY_API_KEY = ''
CLOUDINARY_SECRET_KEY = ''
ADMIN_EMAIL = ''
ADMIN_PASSWORD = ''
JWT_SECRET = ''
```

frontend/.env
```bash
NEXT_PUBLIC_BACKEND_URL = 'http://localhost:4000'
```

Run the development server:

backend
```bash
npm run build
npm start
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

frontend
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


Use npm run dev to start the frontend, npm run build for production and npm start to start backend server.

Project Structure:

Frontend (Next.js): Contains pages for user interfaces like appointment booking, doctor profiles, and dashboards.

Backend (Express.js): Hosts API endpoints for data management.

Database (MongoDB Atlas): Contains collections for users, doctors, appointments.
