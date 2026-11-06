// src/app/dashboard/sales/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Eye } from "lucide-react";
import { getSales } from "@/lib/sales";

export default function SalesPage() {
    const router = useRouter();
    const [sales, setSales] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSales();
    }, [searchTerm]);

    async function loadSales() {
        try {
            setLoading(true);
            const data = await getSales({ search: searchTerm });
            const list = Array.isArray(data) ? data : (data.content || []);
            setSales(list);
        } catch (err) {
            console.error("Error al cargar ventas:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#D7E5EC]">Ventas</h1>
                <button
                    onClick={() => router.push("/dashboard/sales/new")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#54E98A] text-[#003919] font-bold text-xs rounded-md hover:bg-[#43cd77] transition-colors"
                >
                    <Plus size={16} />
                    <span>Nueva Venta</span>
                </button>
            </div>

            <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl p-4 mb-6">
                <div className="flex items-center bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2">
                    <Search className="text-[#54E98A] mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por factura o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-[#D7E5EC] outline-none text-sm placeholder:text-[#6B7280]"
                    />
                </div>
            </div>

            <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left text-sm text-[#BBCBBB]">
                    <thead className="bg-[#101D22] border-b border-[#3D4A3E] text-xs uppercase">
                        <tr>
                            <th className="py-3 px-4">NRO. FACTURA</th>
                            <th className="py-3 px-4">CLIENTE</th>
                            <th className="py-3 px-4">FECHA</th>
                            <th className="py-3 px-4 text-right">TOTAL</th>
                            <th className="py-3 px-4 text-center w-20">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3D4A3E]">
                        {loading ? (
                            <tr><td colSpan={5} className="py-6 text-center text-[#BBCBBB]">Cargando ventas...</td></tr>
                        ) : sales.length === 0 ? (
                            <tr><td colSpan={5} className="py-6 text-center text-[#BBCBBB]">No se encontraron ventas registradas.</td></tr>
                        ) : (
                            sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-[#18282e]">
                                    <td className="py-3 px-4 text-[#D7E5EC] font-mono font-medium">{sale.invoiceNumber}</td>
                                    <td className="py-3 px-4 text-[#D7E5EC]">{sale.clientName || sale.client?.name || "Cliente General"}</td>
                                    <td className="py-3 px-4">{sale.transactionDate ? sale.transactionDate.split('T')[0] : "—"}</td>
                                    <td className="py-3 px-4 text-right text-[#54E98A] font-semibold">
                                        ₲ {(sale.total || 0).toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => router.push(`/dashboard/sales/${sale.id}`)}
                                            className="p-1.5 text-[#BBCBBB] hover:text-[#54E98A] transition-colors"
                                            title="Ver detalle"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}