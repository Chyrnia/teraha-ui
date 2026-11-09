// src/app/dashboard/clients/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ClientList from "@/components/clients/ClientList.jsx";
import ClientFilter from "@/components/clients/ClientFilter.jsx";
import { getClients } from "@/lib/clients.js";

export default function ClientsPage(){
    const [search, setSearch] = useState("");
    const [clients, setClients] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const filters = {
        search,
        page
    };

    useEffect(() => {
        async function fetchClients(){
            setIsLoading(true);
            try {
                const response = await getClients(filters);
                const list = Array.isArray(response) ? response : (response.content || []);
                setClients(list);
                setTotalPages(response.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch clients: " + error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchClients();
    }, [search, page, refreshKey]);

    function handleClientDeactivated() {
        if (clients.length === 1 && page > 0) {
            setPage(current => current - 1);
        } else {
            setRefreshKey(current => current + 1);
        }
    }

    return (
        <section className="p-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#D7E5EC]">Lista de Clientes</h1>
                <Link
                    href='/dashboard/clients/new'
                    className="flex items-center gap-2 px-4 py-2 bg-[#54E98A] rounded-md text-[#003919] font-semibold hover:opacity-90 transition-all"
                >
                    <Plus size={18} />
                    Agregar Cliente
                </Link>
            </div>

            {/* Filters */}
            <ClientFilter 
                search={search}
                setSearch={setSearch}
            />

            {/* Client List */}
            <ClientList 
                clients={clients} 
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                loading={isLoading}
                onClientDeactivated={handleClientDeactivated}
            />
        </section>
    );
}