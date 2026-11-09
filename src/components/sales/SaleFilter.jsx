// src/components/sales/SaleFilter.jsx
"use client";
import { Search } from 'lucide-react';

export default function SaleFilter({ search, setSearch }) {
    return (
        <div className="mt-6 flex bg-[#142126] border border-[#3D4A3E] rounded-xl gap-6 p-4">
            {/* Campo de búsqueda */}
            <div className="flex flex-col">
                <label htmlFor="sale-search" className="text-[#BBCBBB] text-xs">
                    BUSCAR
                </label>
                <div className="w-96 flex items-center rounded-md bg-[#041015] border border-[#3D4A3E]">
                    <input
                        id="sale-search"
                        type="search"
                        placeholder="Buscar por factura o cliente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none py-1 px-4 text-[#D7E5EC] placeholder:text-[#6B7280] outline-none"
                    />
                    <button type="button" className="text-[#003919] bg-[#54E98A] rounded-md py-1 px-1">
                        <Search size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}