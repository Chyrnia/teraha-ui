// src/app/error.js
"use client";

import { useEffect } from "react";
import { TriangleAlert, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error("Error capturado por el boundary:", error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#08151A] px-5 text-[#D7E5EC]">
            <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#142126] p-8 text-center shadow-2xl shadow-black/30">
                {/* Icono */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/[0.08] text-red-400">
                    <TriangleAlert size={32} strokeWidth={1.7} />
                </div>

                <p className="text-xs font-semibold tracking-[0.2em] text-red-400">
                    ERROR 500 / SISTEMA
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                    Algo salió mal
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#8FA4A8]">
                    Ocurrió un error inesperado al procesar tu solicitud o conectar con el servidor. Por favor, inténtalo de nuevo.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-[#54E98A] px-4 py-3 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0] cursor-pointer"
                    >
                        <RotateCcw size={18} />
                        Intentar nuevamente
                    </button>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 w-full rounded-lg border border-[#354C56] bg-[#08151A] px-4 py-3 text-sm font-medium text-[#D7E5EC] transition hover:border-[#54E98A]/50 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                        Volver al dashboard
                    </Link>
                </div>

                <p className="mt-6 text-xs text-[#5F777D]">
                    TERAHA <span className="mx-1.5 text-[#354C56]">/</span> Sistema de gestión
                </p>
            </div>
        </main>
    );
}