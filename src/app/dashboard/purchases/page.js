"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import PurchaseFilter from "@/components/purchases/PurchaseFilter";
import PurchaseList from "@/components/purchases/PurchaseList";
import { getPurchases } from "@/lib/purchases";

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState([]);
    const [search, setSearch] = useState("");
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        async function loadPurchases() {
            const data = await getPurchases();
            setPurchases(data);
        }
        loadPurchases();
    }, []);

    // Filtrado básico por búsqueda y proveedores seleccionados
    const filteredPurchases = purchases.filter(p => {
        const matchesSearch = p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
            p.supplier.toLowerCase().includes(search.toLowerCase());
        const matchesSupplier = suppliers.length === 0 || suppliers.includes(p.supplier);
        return matchesSearch && matchesSupplier;
    });

    const addSupplier = (sup) => {
        if (!suppliers.includes(sup)) setSuppliers([...suppliers, sup]);
    };

    const removeSupplier = (sup) => {
        setSuppliers(suppliers.filter(s => s !== sup));
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#D7E5EC]">Compras</h1>
                    <p className="text-sm text-[#BBCBBB]">Gestión de ingresos de mercadería y facturas de proveedores</p>
                </div>
                <Link
                    href="/dashboard/purchases/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#54E98A] rounded-md text-[#003919] font-semibold hover:opacity-90"
                >
                    <Plus size={18} />
                    <span>Nueva Compra</span>
                </Link>
            </div>

            <PurchaseFilter
                search={search}
                setSearch={setSearch}
                suppliers={suppliers}
                addSupplier={addSupplier}
                removeSupplier={removeSupplier}
            />

            <PurchaseList purchases={filteredPurchases} />
        </div>
    );
}