// src/app/dashboard/sales/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import SaleFilter from "@/components/sales/SaleFilter";
import SaleList from "@/components/sales/SaleList";

export default function SalesPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    return (
        <div className="w-full p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#D7E5EC]">Ventas</h1>
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/sales/new")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#54E98A] rounded-md text-[#003919] font-semibold hover:opacity-90 transition-all"
                >
                    <Plus size={18} />
                    <span>Nueva Venta</span>
                </button>
            </div>

            <SaleFilter search={search} setSearch={setSearch} />
            <SaleList search={search} />
        </div>
    );
}