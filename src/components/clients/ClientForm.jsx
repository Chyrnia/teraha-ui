// src/components/clients/ClientForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    CircleAlert,
    LoaderCircle,
} from "lucide-react";

import { createClient, updateClient } from "@/lib/clients.js";

const INITIAL_CLIENT = {
    name: "",
    document: "",
    address: "",
    email: "",
    phone: "",
    birthDate: "",
};

const inputClass =
    "w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none transition placeholder:text-[#5F777D] focus:border-[#54E98A] focus:ring-2 focus:ring-[#54E98A]/10 disabled:opacity-60";

const labelClass =
    "mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]";

export default function ClientForm({
    client: initialClient,
    mode = "create",
}) {
    const router = useRouter();

    const [client, setClient] = useState(() => ({
        ...INITIAL_CLIENT,
        ...initialClient,
        birthDate: initialClient?.birthDate ?? "",
    }));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setClient((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        const payload = {
            ...client,
        };

        try {
            if (mode === "edit") {
                await updateClient(client.id, payload);
            } else {
                await createClient(payload);
            }

            router.push("/dashboard/clients");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el cliente."
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
                        <User size={21} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-white">
                            Información del cliente
                        </h2>
                        <p className="mt-0.5 text-xs text-[#7F9699]">
                            Datos personales y de contacto.
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="name" className={labelClass}>
                                NOMBRE Y APELLIDO
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={client.name}
                                onChange={handleChange}
                                placeholder="Ej. Juan Pérez"
                                required
                                disabled={isSubmitting}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="document" className={labelClass}>
                                DOCUMENTO / RUC
                            </label>
                            <input
                                id="document"
                                name="document"
                                type="text"
                                value={client.document}
                                onChange={handleChange}
                                placeholder="Ej. 1234567-8"
                                required
                                disabled={isSubmitting}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="phone" className={labelClass}>
                                TELÉFONO
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={client.phone}
                                onChange={handleChange}
                                placeholder="Ej. +595981123456"
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
                                value={client.email}
                                onChange={handleChange}
                                placeholder="Ej. juan.perez@email.com"
                                disabled={isSubmitting}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="birthDate" className={labelClass}>
                                FECHA DE NACIMIENTO
                            </label>
                            <input
                                id="birthDate"
                                name="birthDate"
                                type="date"
                                value={client.birthDate}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className={labelClass}>
                                DIRECCIÓN
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={client.address}
                                onChange={handleChange}
                                placeholder="Ej. Av. Principal 123"
                                disabled={isSubmitting}
                                className={inputClass}
                            />
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
                    onClick={() => router.push("/dashboard/clients")}
                    disabled={isSubmitting}
                    className="rounded-lg border border-[#3D4A3E] px-5 py-2.5 text-sm font-medium text-[#BBCBBB] transition hover:border-[#718A8F] hover:text-white disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#54E98A] px-5 py-2.5 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircle size={17} className="animate-spin" />
                            Guardando...
                        </>
                    ) : mode === "edit" ? (
                        "Guardar cambios"
                    ) : (
                        "Crear cliente"
                    )}
                </button>
            </footer>
        </form>
    );
}