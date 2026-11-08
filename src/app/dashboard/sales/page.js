// src/app/dashboard/sales/page.jsx
"use client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import SaleList from "@/components/sales/SaleList";

export default function SalesPage() {
    const router = useRouter();

    return (
        <div className="w-full p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#D7E5EC]">Ventas</h1>
                <button
                    onClick={() => router.push("/dashboard/sales/new")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#54E98A] text-[#003919] font-bold text-xs rounded-md hover:bg-[#43cd77] transition-colors cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Nueva Venta</span>
                </button>
            </div>

            <SaleList />
        </div>
    );
}