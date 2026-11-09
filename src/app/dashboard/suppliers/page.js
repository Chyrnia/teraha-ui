
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import SupplierList from "@/components/suppliers/SupplierList.jsx";
import SupplierFilter from "@/components/suppliers/SupplierFilter.jsx";
import { getSuppliers } from "@/lib/suppliers.js";

export default function SuppliersPage(){
    const [search, setSearch] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchSuppliers(){
            setIsLoading(true);
            try {
                const response = await getSuppliers({ search, page }, { signal: controller.signal });
                const list = Array.isArray(response) ? response : (response.content || []);
                setSuppliers(list);
                setTotalPages(response.totalPages || 1);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Failed to fetch suppliers: " + error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        const timer = setTimeout(() => {
            fetchSuppliers();
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [search, page]);

    useEffect(() => {
        setPage(0);
    }, [search]);

    return (
        <section className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#D7E5EC]">Lista de Proveedores</h1>
                <Link
                    href='/dashboard/suppliers/new'
                    className="flex items-center gap-2 px-4 py-2 bg-[#54E98A] rounded-md text-[#003919] font-semibold hover:opacity-90 transition-all"
                >
                    <Plus size={18} />
                    Agregar Proveedor
                </Link>
            </div>

            <SupplierFilter 
                search={search}
                setSearch={setSearch}
            />

            <SupplierList 
                suppliers={suppliers} 
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                loading={isLoading}
            />
        </section>
    );
}