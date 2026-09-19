import Header from "@/components/ui/Header.jsx";
import Sidebar from "@/components/ui/Sidebar.jsx";

export default function DashboardLayout({ user, children }) {
    return (
        <div className="flex flex-col h-screen">
            <header>
				<Header user={user} />
            </header>

            <div className="flex flex-1">
				<Sidebar />

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
