// src/components/purchases/PurchaseList.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { getPurchases } from "@/lib/purchases";
import { getSupplierById } from "@/lib/suppliers.js";
import { formatCurrency } from "@/lib/utils"

export default function PurchaseList({ search }) {
    const [purchases, setPurchases] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [supplierMap, setSupplierMap] = useState({});

    useEffect(() => {
        const controller = new AbortController();

        async function loadPurchases() {
            setLoading(true);
            setError("");
            try {
                const data = await getPurchases({ search, page }, { signal: controller.signal });
                const pList = data.content || [];
                setPurchases(pList);
                setTotalPages(data.totalPages || 0);

                const supplierIds = [...new Set(pList.map(p => p.supplierId || p.thirdParty?.id))].filter(Boolean);
                
                const newSupplierMap = { ...supplierMap };
                for (const id of supplierIds) {
                    if (!newSupplierMap[id] && !controller.signal.aborted) {
                        try {
                            const supData = await getSupplierById(id, { signal: controller.signal });
                            newSupplierMap[id] = supData.name;
                        } catch (e) {
                            if (e.name !== "AbortError") {
                                newSupplierMap[id] = "Proveedor desconocido";
                            }
                        }
                    }
                }
                if (!controller.signal.aborted) {
                    setSupplierMap(newSupplierMap);
                }

            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Error al cargar las compras:", err);
                    setError(err.message || "Error al conectar con el servidor.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        const timer = setTimeout(() => {
            loadPurchases();
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [search, page]);

    useEffect(() => {
        setPage(0);
    }, [search]);

    return (
        <div className="w-full mt-6">
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-400 text-xs">
                    {error}
                </div>
            )}

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
                            <th>Proveedor</th>
                            <th className="text-center">Fecha</th>
                            <th className="text-right">Total</th>
                            <th className="text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#BBCBBB] [&_td]:py-3 [&_td]:px-4 divide-y divide-[#3D4A3E]">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-sm">Cargando compras...</td>
                            </tr>
                        ) : purchases.length > 0 ? (
                            purchases.map((p) => {
                                const supId = p.supplierId || p.thirdParty?.id;
                                const supName = supplierMap[supId] || p.supplier || p.thirdParty?.name || 'Proveedor';
                                return (
                                    <tr key={p.id} className="hover:bg-[#18282e]">
                                        <td className="text-left font-semibold text-[#D7E5EC]">{p.invoiceNumber}</td>
                                        <td className="text-left">{supName}</td>
                                        <td className="text-center">{p.date || (p.transactionDate ? p.transactionDate.split('T')[0] : '')}</td>
                                        <td className="text-right text-[#54E98A]"> {formatCurrency(p.total || p.totalAmount || 0)}</td>
                                        <td className="text-center">
                                            <Link
                                                href={`/dashboard/purchases/${p.id}`}
                                                className="inline-flex items-center hover:text-[#54E98A]"
                                                aria-label="Ver compra"
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
                                    No se encontraron registros de compras.
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