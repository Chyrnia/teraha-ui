// src/app/dashboard/users/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import UserList from "@/components/users/UserList.jsx";
import UserFilter from "@/components/users/UserFilter.jsx";
import { getUsers } from "@/lib/users.js";

export default function UsersPage(){
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchUsers(){
            setIsLoading(true);
            try {
                const response = await getUsers({ search, page }, { signal: controller.signal });
                const list = Array.isArray(response) ? response : (response.content || []);
                setUsers(list);
                setTotalPages(response.totalPages || 1);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Failed to fetch users: " + error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        const timer = setTimeout(() => {
            fetchUsers();
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
                <h1 className="text-2xl font-bold text-[#D7E5EC]">Gestión de Usuarios</h1>
                <Link
                    href='/dashboard/users/new'
                    className="flex items-center gap-2 px-4 py-2 bg-[#54E98A] rounded-md text-[#003919] font-semibold hover:opacity-90 transition-all cursor-pointer"
                >
                    <Plus size={18} />
                    Agregar Usuario
                </Link>
            </div>

            <UserFilter 
                search={search}
                setSearch={setSearch}
            />

            <UserList 
                users={users} 
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                loading={isLoading}
            />
        </section>
    );
}