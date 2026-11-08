// src/components/clients/ClientList.jsx
"use client";
import Link from 'next/link';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ClientList({ clients, page, totalPages, onPageChange, loading }) {
    return (
        <div className="w-full">
            <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl overflow-hidden mb-4">
                <table className="w-full border-separate border-spacing-0 text-sm text-[#BBCBBB]">
                    <thead className="bg-[#101D22] border-b border-[#3D4A3E] text-xs uppercase text-[#BBCBBB]">
                        <tr>
                            <th className="py-3 px-4 text-left">Nombre</th>
                            <th className="py-3 px-4 text-left">Documento / RUC</th>
                            <th className="py-3 px-4 text-left">Teléfono</th>
                            <th className="py-3 px-4 text-left">Correo</th>
                            <th className="py-3 px-4 text-center w-24">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3D4A3E]">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-sm">Cargando clientes...</td>
                            </tr>
                        ) : clients.length > 0 ? (
                            clients.map((client) => (
                                <tr key={client.id} className="hover:bg-[#18282e]">
                                    <td className="py-3 px-4 text-[#D7E5EC] font-medium">{client.name}</td>
                                    <td className="py-3 px-4 font-mono">{client.document || "N/A"}</td>
                                    <td className="py-3 px-4">{client.phone || "N/A"}</td>
                                    <td className="py-3 px-4">{client.email || "N/A"}</td>
                                    <td className="py-3 px-4 text-center">
                                        <Link
                                            href={`/dashboard/clients/${client.id}`}
                                            className="inline-flex items-center text-[#BBCBBB] hover:text-[#54E98A] transition-colors"
                                            title="Ver detalle"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-sm text-[#BBCBBB]">
                                    No se encontraron clientes registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Controles de Paginación */}
            <div className="flex justify-between items-center bg-[#142126] border border-[#3D4A3E] rounded-xl px-6 py-4">
                <button
                    type="button"
                    onClick={() => onPageChange(Math.max(page - 1, 0))}
                    disabled={page === 0 || loading}
                    className="flex items-center gap-1 px-4 py-2 bg-[#354C56] text-[#A4BCC7] hover:text-[#54E98A] text-xs font-semibold rounded-md border border-[#3D4A3E] disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={16} />
                    <span>Anterior</span>
                </button>

                <span className="text-xs text-[#BBCBBB]">
                    Página <strong className="text-[#D7E5EC]">{page + 1}</strong> de <strong className="text-[#D7E5EC]">{totalPages || 1}</strong>
                </span>

                <button
                    type="button"
                    onClick={() => onPageChange(page + 1 < totalPages ? page + 1 : page)}
                    disabled={page + 1 >= totalPages || loading}
                    className="flex items-center gap-1 px-4 py-2 bg-[#354C56] text-[#A4BCC7] hover:text-[#54E98A] text-xs font-semibold rounded-md border border-[#3D4A3E] disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    <span>Siguiente</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}