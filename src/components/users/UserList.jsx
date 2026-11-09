// src/components/users/UserList.jsx
"use client";
import Link from 'next/link';
import { Eye, Pencil, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

export default function UserList({ users, page, totalPages, onPageChange, loading }) {
    return (
        <div className="w-full">
            <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl overflow-hidden mb-4">
                <table className="w-full border-separate border-spacing-0 text-sm text-[#BBCBBB]">
                    <thead className="bg-[#101D22] border-b border-[#3D4A3E] text-xs uppercase text-[#BBCBBB]">
                        <tr>
                            <th className="py-3 px-4 text-left">Usuario</th>
                            <th className="py-3 px-4 text-left">Correo Electrónico</th>
                            <th className="py-3 px-4 text-left">Roles</th>
                            <th className="py-3 px-4 text-center">Estado</th>
                            <th className="py-3 px-4 text-center w-28">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3D4A3E]">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-sm">Cargando usuarios...</td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((user) => {
                                const isEnabled = user.enabled !== false;
                                return (
                                    <tr key={user.id} className="hover:bg-[#18282e]">
                                        <td className="py-3 px-4 text-[#D7E5EC] font-semibold">{user.username}</td>
                                        <td className="py-3 px-4">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles?.map((role, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-[#354C56] text-[#54E98A] px-2 py-0.5 rounded font-mono">
                                                        <Shield size={10} />
                                                        {role.name || role}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${
                                                isEnabled ? "bg-[#54E98A]/10 text-[#54E98A]" : "bg-red-400/10 text-red-300"
                                            }`}>
                                                {isEnabled ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link
                                                    href={`/dashboard/users/${user.id}`}
                                                    className="text-[#BBCBBB] hover:text-[#54E98A] transition-colors"
                                                    title="Ver detalle"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/users/${user.id}/edit`}
                                                    className="text-[#BBCBBB] hover:text-[#54E98A] transition-colors"
                                                    title="Editar usuario"
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-sm text-[#BBCBBB]">
                                    No se encontraron usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
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