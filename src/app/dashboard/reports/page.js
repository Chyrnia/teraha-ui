// src/app/dashboard/reports/page.jsx
"use client";
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { getMonthlySummary, getBestClientsBySales, getBestClientsByRevenue } from "@/lib/reports.js";
import {formatCurrency} from "@/lib/utils.js"

export default function ReportsPage() {
    const currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [activeTab, setActiveTab] = useState("summary"); // summary, volume, revenue

    // Estados de Datos
    const [summary, setSummary] = useState(null);
    const [clientsData, setClientsData] = useState({ content: [], totalPages: 0, number: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Cargar datos al cambiar de pestaña, año o mes
    useEffect(() => {
        loadReportData();
    }, [year, month, activeTab]);

    const loadReportData = async (page = 0) => {
        setLoading(true);
        setError("");
        try {
            if (activeTab === "summary") {
                const data = await getMonthlySummary(year, month);
                setSummary(data);
            } else if (activeTab === "volume") {
                const data = await getBestClientsBySales(year, month, page);
                setClientsData(data);
            } else if (activeTab === "revenue") {
                const data = await getBestClientsByRevenue(year, month, page);
                setClientsData(data);
            }
        } catch (err) {
            setError("No se pudieron cargar los datos del reporte para el período seleccionado.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="w-full p-8 space-y-6">
            {/* Cabecera y Filtros de Fecha */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#D7E5EC]">Reportes</h1>
                </div>

                {/* Selectores de Año y Mes */}
                <div className="flex items-center gap-3 bg-[#142126] border border-[#3D4A3E] px-4 py-2.5 rounded-xl shadow-md">
                    <Calendar size={18} className="text-[#54E98A]" />
                    <div className="flex items-center gap-2">
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="bg-[#08151A] text-xs text-[#D7E5EC] border border-[#354C56] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#54E98A]"
                        >
                            {[
                                { num: 1, name: "Enero" }, { num: 2, name: "Febrero" }, { num: 3, name: "Marzo" },
                                { num: 4, name: "Abril" }, { num: 5, name: "Mayo" }, { num: 6, name: "Junio" },
                                { num: 7, name: "Julio" }, { num: 8, name: "Agosto" }, { num: 9, name: "Septiembre" },
                                { num: 10, name: "Octubre" }, { num: 11, name: "Noviembre" }, { num: 12, name: "Diciembre" }
                            ].map((m) => (
                                <option key={m.num} value={m.num}>{m.name}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="w-20 bg-[#08151A] text-xs text-[#D7E5EC] border border-[#354C56] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#54E98A]"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs font-medium">
                    {error}
                </div>
            )}

            {/* Pestañas de Navegación */}
            <div className="flex gap-2 border-b border-[#3D4A3E]">
                <button
                    type="button"
                    onClick={() => setActiveTab("summary")}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                        activeTab === "summary" ? "border-[#54E98A] text-[#54E98A]" : "border-transparent text-[#BBCBBB] hover:text-white"
                    }`}
                >
                    <BarChart3 size={18} />
                    <span>Resumen Mensual Global</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("volume")}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                        activeTab === "volume" ? "border-[#54E98A] text-[#54E98A]" : "border-transparent text-[#BBCBBB] hover:text-white"
                    }`}
                >
                    <Award size={18} />
                    <span>Mejores Clientes (Por Cantidad de Compras)</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("revenue")}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                        activeTab === "revenue" ? "border-[#54E98A] text-[#54E98A]" : "border-transparent text-[#BBCBBB] hover:text-white"
                    }`}
                >
                    <DollarSign size={18} />
                    <span>Mejores Clientes (Por Volumen de Ingresos)</span>
                </button>
            </div>

            {/* CONTENIDO DE LA PESTAÑA 1: RESUMEN MENSUAL */}
            {activeTab === "summary" && (
                <div>
                    {loading ? (
                        <div className="py-20 text-center text-xs text-[#7F9699]">Cargando métricas del mes...</div>
                    ) : summary ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-[#142126] border border-[#3D4A3E] rounded-2xl p-6 shadow-xl flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#7F9699]">INGRESOS TOTALES</p>
                                    <h3 className="text-xl font-bold text-white mt-1">{formatCurrency(summary.totalRevenue)}</h3>
                                </div>
                            </div>

                            <div className="bg-[#142126] border border-[#3D4A3E] rounded-2xl p-6 shadow-xl flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#7F9699]">TOTAL DE VENTAS</p>
                                    <h3 className="text-xl font-bold text-white mt-1">{summary.totalSales} facturas</h3>
                                </div>
                            </div>

                            <div className="bg-[#142126] border border-[#3D4A3E] rounded-2xl p-6 shadow-xl flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                                    <BarChart3 size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#7F9699]">TICKET PROMEDIO</p>
                                    <h3 className="text-xl font-bold text-white mt-1">{formatCurrency(summary.averageTicket)}</h3>
                                </div>
                            </div>

                            <div className="bg-[#142126] border border-[#3D4A3E] rounded-2xl p-6 shadow-xl flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#7F9699]">CLIENTES ATENDIDOS</p>
                                    <h3 className="text-xl font-bold text-white mt-1">{summary.clientsAttended} únicos</h3>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* CONTENIDO DE LAS PESTAÑAS 2 Y 3: RANKING DE CLIENTES */}
            {(activeTab === "volume" || activeTab === "revenue") && (
                <div className="bg-[#142126] border border-[#3D4A3E] rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-[#3D4A3E]">
                        <h2 className="text-base font-semibold text-white">
                            {activeTab === "volume" ? "Ranking de Clientes por Frecuencia de Compras" : "Ranking de Clientes por Mayor Facturación"}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center text-xs text-[#7F9699]">Cargando ranking de clientes...</div>
                    ) : clientsData.content.length === 0 ? (
                        <div className="py-20 text-center text-xs text-[#7F9699]">No se registraron transacciones para este período.</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-[#D7E5EC]">
                                    <thead className="bg-[#08151A] text-[#BBCBBB] border-b border-[#3D4A3E]">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold"># POSICIÓN</th>
                                            <th className="px-6 py-3 font-semibold">CLIENTE</th>
                                            <th className="px-6 py-3 font-semibold">DOCUMENTO / RUC</th>
                                            <th className="px-6 py-3 font-semibold">VENTAS REALIZADAS</th>
                                            <th className="px-6 py-3 font-semibold">MONTO TOTAL FACTURADO</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#3D4A3E]">
                                        {clientsData.content.map((client, idx) => (
                                            <tr key={client.clientId} className="hover:bg-[#354C56]/20 transition-colors">
                                                <td className="px-6 py-4 font-bold text-[#54E98A]">
                                                    {(clientsData.number * 20) + idx + 1}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-white">{client.name}</td>
                                                <td className="px-6 py-4 text-[#BBCBBB]">{client.document}</td>
                                                <td className="px-6 py-4">{client.totalSales} operaciones</td>
                                                <td className="px-6 py-4 font-bold text-[#54E98A]">{formatCurrency(client.totalAmount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-[#3D4A3E] bg-[#08151A]">
                                <span className="text-xs text-[#7F9699]">
                                    Página {clientsData.number + 1} de {clientsData.totalPages || 1}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        disabled={clientsData.number === 0}
                                        onClick={() => loadReportData(clientsData.number - 1)}
                                        className="p-2 rounded-lg border border-[#354C56] bg-[#142126] text-[#BBCBBB] hover:text-white disabled:opacity-40 cursor-pointer"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={clientsData.number + 1 >= clientsData.totalPages}
                                        onClick={() => loadReportData(clientsData.number + 1)}
                                        className="p-2 rounded-lg border border-[#354C56] bg-[#142126] text-[#BBCBBB] hover:text-white disabled:opacity-40 cursor-pointer"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </section>
    );
}