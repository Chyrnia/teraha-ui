// src/app/not-found.js
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#08151A] px-5 text-[#D7E5EC]">
            <div className="w-full max-w-md rounded-2xl border border-[#3D4A3E]/80 bg-[#142126] p-8 text-center shadow-2xl shadow-black/30">
                {/* Icono */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#54E98A]/20 bg-[#54E98A]/[0.08] text-[#54E98A]">
                    <FileQuestion size={32} strokeWidth={1.7} />
                </div>

                <p className="text-xs font-semibold tracking-[0.2em] text-[#54E98A]">
                    ERROR 404
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                    Página no encontrada
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#8FA4A8]">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida a otra sección.
                </p>

                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-[#54E98A] px-4 py-3 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0] focus-visible:outline-2 focus-visible:outline-[#54E98A]"
                    >
                        <ArrowLeft size={18} />
                        Volver al inicio
                    </Link>
                </div>

                <p className="mt-6 text-xs text-[#5F777D]">
                    TERAHA <span className="mx-1.5 text-[#354C56]">/</span> Sistema de gestión
                </p>
            </div>
        </main>
    );
}