// src/components/users/UserForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    UserCog,
    CircleAlert,
    LoaderCircle,
} from "lucide-react";

import { createUser, updateUser } from "@/lib/users.js";

const AVAILABLE_ROLES = [
    { id: "SYSADMIN", label: "Administrador del Sistema (SYSADMIN)" },
    { id: "MANAGER", label: "Gerente (MANAGER)" },
    { id: "SELLER", label: "Vendedor (SELLER)" }
];

const inputClass =
    "w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none transition placeholder:text-[#5F777D] focus:border-[#54E98A] focus:ring-2 focus:ring-[#54E98A]/10 disabled:opacity-60";

const labelClass =
    "mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]";

export default function UserForm({
    user: initialUser,
    mode = "create",
}) {
    const router = useRouter();

    // Mapear roles iniciales a array de strings simples si vienen como objetos
    const initialRoles = initialUser?.roles 
        ? initialUser.roles.map(r => typeof r === 'string' ? r : r.name)
        : ["SELLER"];

    const [user, setUser] = useState(() => ({
        username: initialUser?.username || "",
        email: initialUser?.email || "",
        password: "",
        roles: initialRoles
    }));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setUser((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleRoleToggle(roleName) {
        setUser((current) => {
            const exists = current.roles.includes(roleName);
            let updatedRoles;
            if (exists) {
                // No permitir quedarse sin ningún rol
                if (current.roles.length === 1) return current;
                updatedRoles = current.roles.filter(r => r !== roleName);
            } else {
                updatedRoles = [...current.roles, roleName];
            }
            return { ...current, roles: updatedRoles };
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        try {
            if (mode === "edit") {
                await updateUser(initialUser.id, user);
            } else {
                await createUser(user);
            }
            router.push("/dashboard/users");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el usuario."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 overflow-hidden rounded-2xl border border-[#3D4A3E] bg-[#142126] shadow-xl shadow-black/10"
        >
            <section className="p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                        <UserCog size={21} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-white">
                            Información de la Cuenta
                        </h2>
                        <p className="mt-0.5 text-xs text-[#7F9699]">
                            Credenciales de acceso y permisos asignados.
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="username" className={labelClass}>
                                NOMBRE DE USUARIO
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={user.username}
                                onChange={handleChange}
                                placeholder="Ej. aylen"
                                required
                                disabled={isSubmitting}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className={labelClass}>
                                CORREO ELECTRÓNICO
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Ej. aylen@email.com"
                                required
                                disabled={isSubmitting}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="password" className={labelClass}>
                                {mode === "edit" ? "CONTRASEÑA (DEJAR EN BLANCO PARA NO CAMBIAR)" : "CONTRASEÑA"}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required={mode === "create"}
                                disabled={isSubmitting}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                ROLES DEL SISTEMA
                            </label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {AVAILABLE_ROLES.map((r) => {
                                    const isSelected = user.roles.includes(r.id);
                                    return (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => handleRoleToggle(r.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                                isSelected 
                                                    ? "bg-[#54E98A] text-[#003919] border-[#54E98A]" 
                                                    : "bg-[#08151A] text-[#BBCBBB] border-[#354C56] hover:border-[#718A8F]"
                                            }`}
                                        >
                                            {r.id}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {error && (
                <div
                    role="alert"
                    className="mx-6 mb-5 flex items-start gap-3 rounded-lg border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-200 sm:mx-8"
                >
                    <CircleAlert size={18} className="mt-0.5 shrink-0" />
                    {error}
                </div>
            )}

            <footer className="flex flex-col-reverse gap-3 border-t border-[#3D4A3E] bg-[#101D22]/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/users")}
                    disabled={isSubmitting}
                    className="rounded-lg border border-[#3D4A3E] px-5 py-2.5 text-sm font-medium text-[#BBCBBB] transition hover:border-[#718A8F] hover:text-white disabled:opacity-50 cursor-pointer"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#54E98A] px-5 py-2.5 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircle size={17} className="animate-spin" />
                            Guardando...
                        </>
                    ) : mode === "edit" ? (
                        "Guardar cambios"
                    ) : (
                        "Crear usuario"
                    )}
                </button>
            </footer>
        </form>
    );
}