// src/app/dashboard/sales/[id]/page.jsx
"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ban, Printer } from "lucide-react";
import { getSaleById, cancelSale } from "@/lib/sales";
import { getClientById } from "@/lib/clients";
import { getProductById } from "@/lib/products";
import {formatCurrency} from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth";

export default function SaleDetailPage({ params }) {
    const resolvedParams = use(params);
    const saleId = resolvedParams.id;
    const router = useRouter();

    const [sale, setSale] = useState(null);
    const [clientName, setClientName] = useState("");
    const [clientDocument, setClientDocument] = useState("");
    const [enrichedDetails, setEnrichedDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // 2. Estado para el vendedor autenticado
    const [sellerName, setSellerName] = useState("Cargando...");

    useEffect(() => {
        const currentUser = getCurrentUser();
        setSellerName(currentUser.name);

        async function fetchSaleDetail() {
            try {
                setLoading(true);
                const data = await getSaleById(saleId);
                setSale(data);

                // 1. Obtener datos del cliente
                const clientId = data.clientId || data.client?.id;
                if (clientId) {
                    try {
                        const clientData = await getClientById(clientId);
                        setClientName(clientData.name || "");
                        setClientDocument(clientData.document || "N/A");
                    } catch (e) {
                        setClientName(data.client?.name || "Cliente General");
                        setClientDocument(data.client?.document || "N/A");
                    }
                } else {
                    setClientName("Cliente General");
                    setClientDocument("N/A");
                }

                // 2. Recorrer los detalles y consultar cada producto por su ID
                const rawDetails = data.details || data.items || [];
                
                const enriched = await Promise.all(
                    rawDetails.map(async (detail) => {
                        const prodId = detail.productId || detail.product?.id;
                        let productInfo = {};

                        if (prodId) {
                            try {
                                productInfo = await getProductById(prodId);
                            } catch (err) {
                                console.error(`No se pudo obtener el producto con ID ${prodId}`, err);
                            }
                        }

                        return {
                            ...detail,
                            code: productInfo.code || detail.code || detail.product?.code || "N/A",
                            description: productInfo.description || detail.description || detail.product?.description || "Artículo sin descripción",
                            quantity: detail.quantity ?? 1,
                            unitPrice: detail.unitPrice ?? detail.price ?? 0
                        };
                    })
                );

                setEnrichedDetails(enriched);
            } catch (err) {
                console.error("Error al cargar detalle de venta:", err);
                setError(err.message || "No se pudo cargar la información de la venta.");
            } finally {
                setLoading(false);
            }
        }

        if (saleId) {
            fetchSaleDetail();
        }
    }, [saleId]);

    const handleCancel = async () => {
        const confirmed = window.confirm("¿Estás seguro de que deseas anular esta factura de venta?");
        if (!confirmed) return;

        try {
            await cancelSale(saleId);
            alert("Factura anulada correctamente.");
            router.push("/dashboard/sales");
        } catch (err) {
            alert(`Error al anular la factura: ${err.message}`);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="p-8 text-center text-[#BBCBBB]">Cargando detalles de la venta...</div>;
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-md text-red-400 text-sm">
                    {error}
                </div>
                <button
                    onClick={() => router.push("/dashboard/sales")}
                    className="mt-4 px-4 py-2 bg-[#354C56] text-[#A4BCC7] rounded-md text-xs font-semibold"
                >
                    Volver al listado
                </button>
            </div>
        );
    }

    const totalAmount = sale?.total ?? enrichedDetails.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const saleDate = sale?.transactionDate ? sale.transactionDate.split('T')[0] : (sale?.createdAt?.split('T')[0] || "");
    const [year, month, day] = saleDate ? saleDate.split('-') : ["2026", "11", "07"];

    return (
        <div className="w-full p-8">
            <style jsx global>{`
                @media print {
                    aside, nav, header, button, .no-print {
                        display: none !important;
                    }
                    body * {
                        visibility: hidden !important;
                    }
                    #traditional-invoice, #traditional-invoice * {
                        visibility: visible !important;
                    }
                    #traditional-invoice {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 15px !important;
                        background: white !important;
                        color: black !important;
                        border: 2px solid black !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                    }
                    .print-table th, .print-table td {
                        border: 1px solid black !important;
                        color: black !important;
                        background: white !important;
                    }
                }
            `}</style>

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push("/dashboard/sales")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#354C56] text-[#A4BCC7] hover:text-[#54E98A] text-xs font-semibold rounded-md border border-[#3D4A3E] transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span>Volver</span>
                </button>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-[#354C56] text-[#D7E5EC] hover:bg-[#435f6d] text-xs font-semibold rounded-md border border-[#3D4A3E] transition-colors"
                    >
                        <Printer size={16} />
                        <span>Imprimir Factura</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-semibold rounded-md border border-red-500/30 transition-colors"
                    >
                        <Ban size={16} />
                        <span>Anular Venta</span>
                    </button>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-[#D7E5EC] mb-6">
                Detalle de Factura de Venta
            </h1>

            <div 
                id="traditional-invoice" 
                className="bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 mb-6"
            >
                {/* Cabecera Clásica para Impresión */}
                <div className="hidden print:flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-wide text-black">
                            Teraha
                        </h2>
                        <p className="text-xs text-gray-700">Comprobante de Factura Emitida</p>
                    </div>
                    <div className="text-right border border-black p-3 min-w-[210px] bg-white">
                        <span className="block text-xs font-bold uppercase text-black">FACTURA N°</span>
                        <span className="text-lg font-mono font-bold text-red-600">
                            {sale?.invoiceNumber || "001-001-0000000"}
                        </span>
                        <div className="flex justify-between text-[11px] mt-2 pt-2 border-t border-black gap-2 text-black font-semibold">
                            <span>DÍA: {day || "--"}</span>
                            <span>MES: {month || "--"}</span>
                            <span>AÑO: {year || "--"}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-4 print:grid-cols-2 print:gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2 print:text-black print:font-bold">CLIENTE</label>
                        <input
                            type="text"
                            readOnly
                            value={clientName || "Cliente General"}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none print:bg-transparent print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1 print:text-black print:font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2 print:text-black print:font-bold">DOCUMENTO / RUC</label>
                        <input
                            type="text"
                            readOnly
                            value={clientDocument || "N/A"}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#BBCBBB] outline-none print:bg-transparent print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1 print:text-black print:font-medium"
                        />
                    </div>

                    <div className="print:hidden">
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">VENDEDOR</label>
                        <input
                            type="text"
                            readOnly
                            value={sellerName}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#BBCBBB] outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6 print:grid-cols-1 print:gap-4">
                    <div className="print:hidden">
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">FECHA</label>
                        <input
                            type="text"
                            readOnly
                            value={saleDate}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none"
                        />
                    </div>

                    <div className="print:hidden">
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">Nº FACTURA</label>
                        <input
                            type="text"
                            readOnly
                            value={sale?.invoiceNumber || ""}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none"
                        />
                    </div>

                </div>

                <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl overflow-hidden mb-6 print:bg-white print:border print:border-black print:rounded-none">
                    <table className="w-full text-left text-sm text-[#BBCBBB] print:text-black print:text-xs print-table">
                        <thead className="bg-[#101D22] border-b border-[#3D4A3E] text-xs uppercase print:bg-gray-200 print:border-b-2 print:border-black print:text-black">
                            <tr>
                                <th className="py-3 px-4 w-12 text-center print:border print:border-black">#</th>
                                <th className="py-3 px-4 w-36 print:border print:border-black">CÓDIGO</th>
                                <th className="py-3 px-4 print:border print:border-black">DETALLES DEL ARTÍCULO</th>
                                <th className="py-3 px-4 w-40 text-right print:border print:border-black">PRECIO UNITARIO</th>
                                <th className="py-3 px-4 w-28 text-center print:border print:border-black">CANTIDAD</th>
                                <th className="py-3 px-4 w-36 text-right print:border print:border-black">SUBTOTAL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3D4A3E] print:divide-black">
                            {enrichedDetails.map((item, idx) => {
                                const subtotal = item.unitPrice * item.quantity;
                                return (
                                    <tr key={idx} className="print:border-b print:border-black">
                                        <td className="py-3 px-4 text-center print:border print:border-black">{idx + 1}</td>
                                        <td className="py-3 px-4 font-mono print:border print:border-black">{item.code}</td>
                                        <td className="py-3 px-4 font-medium print:border print:border-black">{item.description}</td>
                                        <td className="py-3 px-4 text-right print:border print:border-black">{formatCurrency(item.unitPrice)}</td>
                                        <td className="py-3 px-4 text-center font-bold print:border print:border-black">{item.quantity}</td>
                                        <td className="py-3 px-4 text-right text-[#54E98A] font-semibold print:text-black print:border print:border-black">
                                            {formatCurrency(subtotal)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end items-center bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 print:bg-white print:border-0 print:p-0 print:mt-4">
                    <div className="text-right border-2 border-black p-3 bg-[#101D22] print:bg-gray-50 min-w-[260px] rounded-lg print:rounded-none">
                        <span className="block text-xs uppercase text-[#BBCBBB] print:text-black font-bold">TOTAL FACTURA</span>
                        <span className="text-2xl font-bold text-[#54E98A] print:text-black">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
