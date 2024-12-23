import AdminContextProvider from "../context/AdminContext";
import PanelContextProvider from "../context/PanelContext";
import DoctorContextProvider from "../context/DoctorContext";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="font-work-sans">



            <AdminContextProvider>
                <DoctorContextProvider>
                    <PanelContextProvider>
                        {children}
                    </PanelContextProvider>
                </DoctorContextProvider>
            </AdminContextProvider>

        </main>
    );
}