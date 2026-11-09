// src/app/dashboard/users/[id]/edit/page.jsx
"use client";
import { useState, useEffect, use } from "react";
import { getUserById } from "@/lib/users.js";
import UserForm from "@/components/users/UserForm.jsx";

export default function EditUserPage({ params }) {
    const resolvedParams = use(params);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getUserById(resolvedParams.id);
                setUser(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [resolvedParams.id]);

    if (loading) return <div className="p-8 text-[#BBCBBB]">Cargando...</div>;

    return (
        <section className="p-8">
            <h1 className="text-2xl font-bold text-[#D7E5EC]">Editar Usuario</h1>
            <UserForm user={user} mode="edit" />
        </section>
    );
}