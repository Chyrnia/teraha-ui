// src/components/sales/SaleList.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { getSales } from "@/lib/sales";
import { getClientById } from "@/lib/clients";

export default function SaleList() {
    const [sales, setSales] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [clientMap, setClientMap] = useState({});

    useEffect(() => {
        async function loadSales() {
            setLoading(true);
            setError("");
            try {
                // Pasamos el término de búsqueda y el número de página actual
                const data = await getSales({ search, page });
                const sList = data.content || [];
                setSales(sList);
                setTotalPages(data.totalPages || 0);

                // Cargar nombres de clientes únicos para esta página (según SaleInvoiceDTO con clientId)
                const clientIds = [...new Set(sList.map(s => s.clientId || s.client?.id))].filter(Boolean);
                
                const newClientMap = { ...clientMap };
                for (const id of clientIds) {
                    if (!newClientMap[id]) {
                        try {
                            const clientData = await getClientById(id);
                            newClientMap[id] = clientData.name;
                        } catch (e) {
                            newClientMap[id] = "Cliente General";
                        }
                    }
                }
                setClientMap(newClientMap);

            } catch (err) {
                console.error("Error al cargar las ventas:", err);
                setError(err.message || "Error al conectar con el servidor.");
            } finally {
                setLoading(false);
            }
        }

        const timer = setTimeout(() => {
            loadSales();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, page]);

    // Cada vez que el usuario escriba en el buscador, regresamos a la página 0
    useEffect(() => {
        setPage(0);
    }, [search]);

    return (
        <div className="w-full">
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-400 text-xs">
                    {error}
                </div>
            )}

            {/* Tabla de Listado */}
            <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl overflow-hidden mb-4">
                <table className="w-full border-separate border-spacing-0">
                    <colgroup>
                        <col/>
                        <col/>
                        <col/>
                        <col/>
                        <col className="w-24"/>
                    </colgroup>
                    <thead className="[&_th]:py-3 [&_th]:px-4">
                        <tr className="bg-[#101D22] text-[#BBCBBB] text-xs uppercase text-left">
                            <th>Nro. Factura</th>
                            <th>Cliente</th>
                            <th className="text-center">Fecha</th>
                            <th className="text-right">Total</th>
                            <th className="text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#BBCBBB] [&_td]:py-3 [&_td]:px-4 divide-y divide-[#3D4A3E]">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-sm">Cargando ventas desde el servidor...</td>
                            </tr>
                        ) : sales.length > 0 ? (
                            sales.map((s) => {
                                const clientId = s.clientId || s.client?.id;
                                const clientName = clientMap[clientId] || s.clientName || s.client?.name || 'Cliente General';
                                const saleDate = s.date || (s.transactionDate ? s.transactionDate.split('T')[0] : '');
                                const saleTotal = s.total || s.totalAmount || 0;

                                return (
                                    <tr key={s.id} className="hover:bg-[#18282e]">
                                        <td className="text-left font-semibold text-[#D7E5EC]">{s.invoiceNumber}</td>
                                        <td className="text-left">{clientName}</td>
                                        <td className="text-center">{saleDate}</td>
                                        <td className="text-right text-[#54E98A]">₲ {saleTotal.toLocaleString()}</td>
                                        <td className="text-center">
                                            <Link
                                                href={`/dashboard/sales/${s.id}`}
                                                className="inline-flex items-center hover:text-[#54E98A]"
                                                aria-label="Ver venta"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-sm text-[#BBCBBB]">
                                    No se encontraron registros de ventas.
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
                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
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
                    onClick={() => setPage(prev => (page + 1 < totalPages ? prev + 1 : prev))}
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