'use client'
import { DoctorContext } from "@/app/context/DoctorContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
    const router = useRouter();

    const { dToken } = useContext(DoctorContext)

    useEffect(() => {
        const token = localStorage.getItem("dToken");

        if (!token) {
            // If no token, redirect to login page
            router.push("/doctorLogin");
        }
    }, [router]);

    return (
        <div>
            <h1>Welcome to the Doctor Page</h1>
        </div>
    );
};