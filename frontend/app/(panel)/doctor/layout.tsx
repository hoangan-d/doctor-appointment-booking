import DoctorSidebar from "@/components/DoctorSidebar";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            {/* DoctorSidebar */}
            <DoctorSidebar />

            {/* Main content */}
            <main className="flex-1 bg-gray-100 p-6 font-work-sans">
                {children}
            </main>
        </div>
    )

}