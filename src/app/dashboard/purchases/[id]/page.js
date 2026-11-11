// src/app/dashboard/purchases/[id]/page.jsx
"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ban, Printer } from "lucide-react";
import { getPurchaseById, cancelPurchase } from "@/lib/purchases";
import { getSupplierById } from "@/lib/suppliers";
import { getProductById } from "@/lib/products";
import {formatCurrency} from "@/lib/utils"

export default function PurchaseDetailPage({ params }) {
    const resolvedParams = use(params);
    const purchaseId = resolvedParams.id;
    const router = useRouter();

    const [purchase, setPurchase] = useState(null);
    const [supplierName, setSupplierName] = useState("");
    const [supplierRuc, setSupplierRuc] = useState("");
    const [enrichedDetails, setEnrichedDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPurchaseDetail() {
            try {
                setLoading(true);
                const data = await getPurchaseById(purchaseId);
                setPurchase(data);

                // 1. Obtener datos del proveedor
                const supId = data.supplierId || data.thirdParty?.id;
                if (supId) {
                    try {
                        const supData = await getSupplierById(supId);
                        setSupplierName(supData.name || "");
                        setSupplierRuc(supData.document || supData.ruc || "");
                    } catch (e) {
                        setSupplierName(data.supplier || "Proveedor desconocido");
                    }
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
                            unitCost: detail.unitCost ?? detail.cost ?? 0
                        };
                    })
                );

                setEnrichedDetails(enriched);
            } catch (err) {
                console.error("Error al cargar detalle de compra:", err);
                setError(err.message || "No se pudo cargar la información de la compra.");
            } finally {
                setLoading(false);
            }
        }

        if (purchaseId) {
            fetchPurchaseDetail();
        }
    }, [purchaseId]);

    const handleCancel = async () => {
        const confirmed = window.confirm("¿Estás seguro de que deseas anular esta factura de compra?");
        if (!confirmed) return;

        try {
            await cancelPurchase(purchaseId);
            alert("Factura anulada correctamente.");
            router.push("/dashboard/purchases");
        } catch (err) {
            alert(`Error al anular la factura: ${err.message}`);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="p-8 text-center text-[#BBCBBB]">Cargando detalles de la compra...</div>;
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-md text-red-400 text-sm">
                    {error}
                </div>
                <button
                    onClick={() => router.push("/dashboard/purchases")}
                    className="mt-4 px-4 py-2 bg-[#354C56] text-[#A4BCC7] rounded-md text-xs font-semibold"
                >
                    Volver al listado
                </button>
            </div>
        );
    }

    const totalAmount = purchase?.total ?? enrichedDetails.reduce((acc, item) => acc + (item.unitCost * item.quantity), 0);
    const purchaseDate = purchase?.transactionDate ? purchase.transactionDate.split('T')[0] : (purchase?.createdAt?.split('T')[0] || "");
    const [year, month, day] = purchaseDate ? purchaseDate.split('-') : ["2026", "11", "04"];

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
                    onClick={() => router.push("/dashboard/purchases")}
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
                        <span>Anular Compra</span>
                    </button>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-[#D7E5EC] mb-6">
                Detalle de Factura de Compra
            </h1>

            <div 
                id="traditional-invoice" 
                className="bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 mb-6"
            >
                {/* Cabecera Clásica para Impresión */}
                <div className="hidden print:flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-wide text-black">
                            ESENCIA - GESTIÓN DE COMPRAS
                        </h2>
                        <p className="text-xs text-gray-700">Comprobante de Registro de Compra</p>
                    </div>
                    <div className="text-right border border-black p-3 min-w-[210px] bg-white">
                        <span className="block text-xs font-bold uppercase text-black">FACTURA N°</span>
                        <span className="text-lg font-mono font-bold text-red-600">
                            {purchase?.invoiceNumber || "001-001-0000000"}
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
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2 print:text-black print:font-bold">PROVEEDOR</label>
                        <input
                            type="text"
                            readOnly
                            value={supplierName || "Proveedor desconocido"}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none print:bg-transparent print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1 print:text-black print:font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2 print:text-black print:font-bold">RUC / DOCUMENTO</label>
                        <input
                            type="text"
                            readOnly
                            value={supplierRuc || "N/A"}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none print:bg-transparent print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1 print:text-black print:font-medium"
                        />
                    </div>

                    <div className="print:hidden">
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">VENDEDOR</label>
                        <input
                            type="text"
                            readOnly
                            value="Retail Manager"
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
                            value={purchaseDate}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none"
                        />
                    </div>

                    <div className="print:hidden">
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">Nº FACTURA</label>
                        <input
                            type="text"
                            readOnly
                            value={purchase?.invoiceNumber || ""}
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
                                <th className="py-3 px-4 w-40 text-right print:border print:border-black">COSTO UNITARIO</th>
                                <th className="py-3 px-4 w-28 text-center print:border print:border-black">CANTIDAD</th>
                                <th className="py-3 px-4 w-36 text-right print:border print:border-black">SUBTOTAL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3D4A3E] print:divide-black">
                            {enrichedDetails.map((item, idx) => {
                                const subtotal = item.unitCost * item.quantity;
                                return (
                                    <tr key={idx} className="print:border-b print:border-black">
                                        <td className="py-3 px-4 text-center print:border print:border-black">{idx + 1}</td>
                                        <td className="py-3 px-4 font-mono print:border print:border-black">{item.code}</td>
                                        <td className="py-3 px-4 font-medium print:border print:border-black">{item.description}</td>
                                        <td className="py-3 px-4 text-right print:border print:border-black">{formatCurrency(item.unitCost)}</td>
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