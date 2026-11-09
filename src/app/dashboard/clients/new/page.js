// src/app/dashboard/clients/new/page.jsx
"use client";

import ClientForm from "@/components/clients/ClientForm.jsx";

export default function NewClientPage() {
    return (
        <section className="p-8">
            <h1 className="text-2xl font-bold text-[#D7E5EC]">Nuevo Cliente</h1>
            <ClientForm mode="create" />
        </section>
    );
}