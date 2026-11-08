// src/components/clients/EditClientClient.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CircleAlert,
    LoaderCircle,
} from "lucide-react";

import { getClientById } from "@/lib/clients.js";
import ClientForm from "@/components/clients/ClientForm.jsx";

export default function EditClientClient({ id }) {
    const [client, setClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchClient() {
            setIsLoading(true);
            setError("");

            try {
                const result = await getClientById(id);

                if (!cancelled) {
                    if (!result) {
                        setError("Cliente no encontrado.");
                    } else {
                        setClient(result);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudo cargar el cliente."
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchClient();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="mt-6 flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-[#3D4A3E] bg-[#142126] text-sm text-[#8FA4A8]">
                <LoaderCircle
                    size={20}
                    className="animate-spin text-[#54E98A]"
                />
                Cargando cliente...
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="mt-6 rounded-2xl border border-[#3D4A3E] bg-[#142126] p-8">
                <div className="flex items-start gap-3">
                    <CircleAlert
                        size={21}
                        className="mt-0.5 shrink-0 text-red-300"
                    />

                    <div>
                        <h2 className="font-semibold text-white">
                            No se pudo cargar el cliente
                        </h2>

                        <p className="mt-2 text-sm text-[#A4BCC7]">
                            {error || "Cliente no encontrado."}
                        </p>
                    </div>
                </div>

                <Link
                    href="/dashboard/clients"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#54E98A] px-4 py-2.5 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0]"
                >
                    <ArrowLeft size={16} />
                    Volver a clientes
                </Link>
            </div>
        );
    }

    return (
        <ClientForm
            client={client}
            mode="edit"
        />
    );
}