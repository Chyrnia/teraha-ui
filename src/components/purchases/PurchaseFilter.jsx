"use client";
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getSupplierCategories } from "@/lib/purchases.js";

export default function PurchaseFilter({ search, setSearch, suppliers, addSupplier, removeSupplier }) {
    const [supplierList, setSupplierList] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");

    useEffect(() => {
        async function fetchSuppliers() {
            const response = await getSupplierCategories();
            setSupplierList(response);
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

            {/* Filtros por Proveedor */}
            <div className="flex-1">
				<span className="block text-[#BBCBBB] text-xs">
					FILTROS
				</span>
                <div className="flex gap-4 items-center mt-1">
                    <div>
                        <select
                            id="supplier-filter"
                            value={selectedSupplier}
                            onChange={(e) => {
                                if (e.target.value !== "") {
                                    addSupplier(e.target.value);
                                    setSelectedSupplier("");
                                }
                            }}
                            className="py-1 px-4 border border-[#3D4A3E] text-center text-semibold text-[#54E98A] rounded-md bg-[#041015]"
                        >
                            <option value="">Proveedor</option>
                            {supplierList.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 flex flex-wrap gap-2">
                        {suppliers.map(sup => (
                            <div
                                className="flex items-center gap-1 rounded-full bg-[#354C56] px-3 py-1"
                                key={sup}
                            >
                                <button
                                    aria-label={`Quitar filtro ${sup}`}
                                    onClick={() => removeSupplier(sup)}
                                    className="text-[#A4BCC7] text-xs"
                                >
                                    {sup} ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}