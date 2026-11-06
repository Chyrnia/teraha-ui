"use client";
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getSuppliers } from "@/lib/suppliers.js";

export default function PurchaseFilter({ search, setSearch, suppliers, addSupplier, removeSupplier }) {
    const [supplierList, setSupplierList] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");

    useEffect(() => {
        async function fetchSuppliers() {
            const response = await getSuppliers();
            setSupplierList(response.content || []);
        }
        fetchSuppliers();
    }, []);

    return (
        <div className="mt-6 flex bg-[#142126] border border-[#3D4A3E] rounded-xl gap-6 p-4">
            {/* Campo de búsqueda */}
            <div className="flex flex-col">
                <label htmlFor="purchase-search" className="text-[#BBCBBB] text-xs">
                    BUSCAR
                </label>
                <div className="w-96 flex items-center rounded-md bg-[#041015] border border-[#3D4A3E]">
                    <input
                        id="purchase-search"
                        type="search"
                        placeholder="Buscar por factura o proveedor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none py-1 px-4 text-[#6B7280] placeholder:text-[#6B7280] outline-none"
                    />
                    <button className="text-[#003919] bg-[#54E98A] rounded-md py-1 px-1">
                        <Search />
                    </button>
                </div>
            </div>

        </div>
    );
}