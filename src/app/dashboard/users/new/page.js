// src/app/dashboard/users/new/page.jsx
"use client";
import UserForm from "@/components/users/UserForm.jsx";

export default function NewUserPage() {
    return (
        <section className="p-8">
            <h1 className="text-2xl font-bold text-[#D7E5EC]">Nuevo Usuario</h1>
            <UserForm mode="create" />
        </section>
    );
}