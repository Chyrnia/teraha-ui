// src/components/clients/ClientDetails.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CircleAlert,
    LoaderCircle,
    Mail,
    MapPin,
    Pencil,
    Phone,
    User,
    Calendar,
    FileText,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import { getClientById } from "@/lib/clients.js";

function DetailCard({ icon: Icon, label, value, accent = false, detail }) {
    return (
        <div className="rounded-xl border border-[#354C56]/70 bg-[#08151A]/60 p-4">
            <div className="flex items-center gap-2 text-[#718A8F]">
                <Icon size={16} />
                <span className="text-xs font-semibold tracking-wide">
                    {label}
                </span>
            </div>

            <p
                className={`mt-3 text-lg font-semibold truncate ${
                    accent ? "text-[#54E98A]" : "text-[#D7E5EC]"
                }`}
            >
                {value || "—"}
            </p>

            {detail && (
                <p className="mt-1 text-xs text-[#718A8F]">
                    {detail}
                </p>
            )}
        </div>
    );
}

export default function ClientDetails({ id }) {
    const [client, setClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function fetchClient() {
            setIsLoading(true);
            setError("");
            setClient(null);

            try {
                if (!id) {
                    setError("Cliente no encontrado.");
                    return;
                }

                const result = await getClientById(id);

                if (!result) {
                    setError("Cliente no encontrado.");
                    return;
                }

                if (ignore) return;

                setClient(result);
            } catch (err) {
                if (!ignore) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudo cargar el cliente."
                    );
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        fetchClient();

        return () => {
            ignore = true;
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="mt-6 flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-[#3D4A3E] bg-[#142126] text-sm text-[#8FA4A8]">
                <LoaderCircle
                    size={20}
                    className="animate-spin text-[#54E98A]"
                />
                Cargando información del cliente...
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

    const isActive = client.active !== false;

    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#3D4A3E] bg-[#142126] shadow-xl shadow-black/10">

            {/* Client heading */}
            <header className="flex flex-col gap-5 border-b border-[#3D4A3E] bg-[#101D22]/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#54E98A]/20 bg-[#54E98A]/10 text-[#54E98A]">
                        <User size={27} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-semibold tracking-[0.16em] text-[#54E98A]">
                                CLIENTE #{client.id}
                            </span>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                                    isActive
                                        ? "bg-[#54E98A]/10 text-[#54E98A]"
                                        : "bg-red-400/10 text-red-300"
                                }`}
                            >
                                {isActive ? "Activo" : "Inactivo"}
                            </span>
                        </div>

                        <h2 className="truncate text-xl font-semibold text-white sm:text-2xl">
                            {client.name}
                        </h2>

                        <p className="mt-1 text-sm text-[#8FA4A8]">
                            Documento / RUC: {client.document || "N/A"}
                        </p>
                    </div>
                </div>

                <Link
                    href={`/dashboard/clients/${client.id}/edit`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#54E98A] px-4 py-2.5 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0]"
                >
                    <Pencil size={16} />
                    Editar cliente
                </Link>
            </header>

            <div className="p-6 sm:p-8">
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white">
                        Información general y contacto
                    </h3>

                    <p className="mt-1 text-xs text-[#7F9699]">
                        Datos personales y de localización registrados.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <DetailCard
                        icon={FileText}
                        label="DOCUMENTO / RUC"
                        value={client.document}
                        accent
                    />

                    <DetailCard
                        icon={Phone}
                        label="TELÉFONO"
                        value={client.phone}
                    />

                    <DetailCard
                        icon={Mail}
                        label="CORREO ELECTRÓNICO"
                        value={client.email}
                    />

                    <DetailCard
                        icon={Calendar}
                        label="FECHA DE NACIMIENTO"
                        value={client.birthDate}
                    />

                    <DetailCard
                        icon={MapPin}
                        label="DIRECCIÓN"
                        value={client.address}
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="flex justify-start border-t border-[#3D4A3E] bg-[#101D22]/70 px-6 py-5 sm:px-8">
                <Link
                    href="/dashboard/clients"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#3D4A3E] px-4 py-2.5 text-sm font-medium text-[#BBCBBB] transition hover:border-[#718A8F] hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Volver a clientes
                </Link>
            </footer>
        </div>
    );
}