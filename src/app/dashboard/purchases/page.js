// src/app/dashboard/purchases/page.js
"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import PurchaseFilter from "@/components/purchases/PurchaseFilter";
import PurchaseList from "@/components/purchases/PurchaseList";

export default function PurchasesPage() {
    const [search, setSearch] = useState("");
    const [suppliers, setSuppliers] = useState([]);

    const addSupplier = (sup) => {
        if (!suppliers.includes(sup)) setSuppliers([...suppliers, sup]);
    };

    const removeSupplier = (sup) => {
        setSuppliers(suppliers.filter(s => s !== sup));
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#D7E5EC]">Compras</h1>
                </div>
                <Link
                    href="/dashboard/purchases/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#54E98A] rounded-md text-[#003919] font-semibold hover:opacity-90 transition-all"
                >
                    <Plus size={18} />
                    <span>Nueva Compra</span>
                </Link>
            </div>

            {/* El filtro visual donde el usuario escribe */}
            <PurchaseFilter
                search={search}
                setSearch={setSearch}
                suppliers={suppliers}
                addSupplier={addSupplier}
                removeSupplier={removeSupplier}
            />
            <PurchaseList search={search} />
        </div>
    );
}