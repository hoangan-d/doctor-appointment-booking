'use client'
import { AdminContext } from "@/app/context/AdminContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
    const router = useRouter();

    const { aToken } = useContext(AdminContext)

    useEffect(() => {
        const token = localStorage.getItem("aToken");

        if (!token) {
            // If no token, redirect to login page
            router.push("/adminLogin");
        }
    }, [router]);

    return (
        <div>
            <h1>Welcome to the Admin Page</h1>
        </div>
    );
};