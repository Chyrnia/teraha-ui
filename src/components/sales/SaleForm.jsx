// src/components/sales/SaleForm.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Barcode, Search, ArrowRight } from "lucide-react";
import ProductSearchModal from "@/components/purchases/ProductSearchModal";
import ClientSearchModal from "@/components/sales/ClientSearchModal";
import { getProducts } from "@/lib/products";
import { createSaleInvoice } from "@/lib/sales";
import { formatCurrency } from "@/lib/utils"

export default function SaleForm() {
    const router = useRouter();
    
    const [header, setHeader] = useState({
        clientId: null,
        clientName: "",
        clientDocument: "",
        seller: "Retail Manager",
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: `001-001-${Math.floor(100000 + Math.random() * 900000)}`
    });

    const [items, setItems] = useState([]);
    const [skuInput, setSkuInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (items.length > 0) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [items]);

    const handleAddProduct = (product) => {
        // 1. Obtenemos el stock disponible del producto (ajusta a 'product.stock' según tu base de datos)
        const availableStock = product.stock ?? 0;

        const existingIndex = items.findIndex(i => i.code === product.code);

        if (existingIndex >= 0) {
            // El producto ya está en la lista, calculamos la cantidad futura al sumarle 1
            const nextQuantity = items[existingIndex].quantity + 1;

            if (nextQuantity > availableStock) {
                alert(`Stock insuficiente. Solo hay ${availableStock} unidades disponibles de "${product.description || product.code}".`);
                return; // Detenemos para que no supere el stock
            }

            const updated = [...items];
            updated[existingIndex].quantity = nextQuantity;
            setItems(updated);
        } else {
            // Es un producto nuevo, validamos si su stock es 0 o menor
            if (availableStock <= 0) {
                alert(`El producto "${product.description || product.code}" tiene stock cero (0) y no se puede añadir a la factura.`);
                return; // Detenemos para que no se agregue
            }

            setItems([
                ...items,
                {
                    id: product.id,
                    code: product.code,
                    description: product.description,
                    price: Number(product.price || 0),
                    quantity: 1
                }
            ]);
        }
        
        setSkuInput("");
    };

    const updateQuantityDirect = (index, value) => {
        const newQty = parseInt(value, 10);
        const updated = [...items];
        updated[index].quantity = isNaN(newQty) ? "" : newQty;
        setItems(updated);
    };

    const handleQuantityBlur = (index) => {
        const updated = [...items];
        if (!updated[index].quantity || updated[index].quantity < 1) {
            updated[index].quantity = 1;
            setItems(updated);
        }
    };

    const updateQuantity = (index, delta) => {
        const updated = [...items];
        const newQty = updated[index].quantity + delta;
        if (newQty > 0) {
            updated[index].quantity = newQty;
            setItems(updated);
        }
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleCompleteSale = async () => {
        if (items.length === 0) {
            alert("Debe agregar al menos un producto a la venta.");
            return;
        }

        if (!header.clientId) {
            alert("Por favor seleccione un cliente válido.");
            return;
        }

        const confirmSale = window.confirm(
            `¿Confirma el registro de la venta ${header.invoiceNumber} por un total de ₲ ${totalAmount.toLocaleString()}?`
        );

        if (!confirmSale) return;

        setLoading(true);

        const salePayload = {
            transactionDate: new Date().toISOString(), // Enviado en formato ISO requerido por el backend
            clientId: Number(header.clientId),
            details: items.map(item => ({
                productId: Number(item.id),
                quantity: Number(item.quantity),
                unitPrice: Number(item.price)
            }))
        };

        try {
            await createSaleInvoice(salePayload);
            alert("¡Venta registrada correctamente en el sistema!");
            router.push("/dashboard/sales");
        } catch (error) {
            console.error("Error al registrar venta:", error);
            alert(`Hubo un error al registrar la venta: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="w-full p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#D7E5EC]">Nueva Venta</h1>
                <button
                    type="button"
                    onClick={() => {
                        if (items.length > 0 && !window.confirm("¿Descartar venta actual?")) return;
                        setItems([]);
                    }}
                    className="px-4 py-2 bg-[#354C56] text-[#A4BCC7] hover:text-[#54E98A] text-xs font-semibold rounded-md border border-[#3D4A3E] transition-colors"
                >
                    Reiniciar / Nueva Venta
                </button>
            </div>

            {/* DATOS DEL CLIENTE Y FACTURA */}
            <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-6 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">CLIENTE</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                placeholder="Seleccione cliente..."
                                value={header.clientName}
                                className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none cursor-pointer"
                                onClick={() => setIsClientModalOpen(true)}
                            />
                            <button 
                                type="button" 
                                onClick={() => setIsClientModalOpen(true)}
                                className="bg-[#54E98A] text-[#003919] p-2 rounded-md hover:bg-[#43cd77] transition-colors"
                                title="Buscar cliente"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">DOCUMENTO / RUC</label>
                        <input
                            type="text"
                            readOnly
                            placeholder="Documento del cliente"
                            value={header.clientDocument}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#BBCBBB] outline-none"
                        />
                    </div>

                </div>
            </div>

            {/* TABLA DE PRODUCTOS */}
            <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left text-sm text-[#BBCBBB]">
                    <thead className="bg-[#101D22] border-b border-[#3D4A3E] text-xs uppercase">
                        <tr>
                            <th className="py-3 px-4 w-12 text-center">#</th>
                            <th className="py-3 px-4 w-36">CÓDIGO</th>
                            <th className="py-3 px-4">DETALLES DEL ARTÍCULO</th>
                            <th className="py-3 px-4 w-36 text-right">PRECIO UNITARIO</th>
                            <th className="py-3 px-4 w-36 text-center">CANTIDAD</th>
                            <th className="py-3 px-4 w-36 text-right">SUBTOTAL</th>
                            <th className="py-3 px-4 w-16 text-center">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3D4A3E]">
                        {items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-[#18282e]">
                                <td className="py-3 px-4 text-center">{idx + 1}</td>
                                <td className="py-3 px-4 text-[#D7E5EC] font-mono">{item.code}</td>
                                <td className="py-3 px-4 text-[#D7E5EC] font-medium">{item.description}</td>
                                
                                <td className="py-3 px-4 text-right">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.price}
                                        onChange={(e) => {
                                            const newPrice = Number(e.target.value);
                                            const updated = [...items];
                                            updated[idx].price = isNaN(newPrice) ? 0 : newPrice;
                                            setItems(updated);
                                        }}
                                        className="w-32 bg-[#041015] border border-[#3D4A3E] rounded px-2 py-1 text-right text-[#54E98A] outline-none focus:border-[#54E98A] [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                </td>

                                <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center bg-[#041015] border border-[#3D4A3E] rounded-md px-1">
                                        <button type="button" onClick={() => updateQuantity(idx, -1)} className="px-2 py-1 text-[#54E98A] hover:bg-[#354C56] rounded">-</button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantityDirect(idx, e.target.value)}
                                            onBlur={() => handleQuantityBlur(idx)}
                                            className="w-16 bg-transparent text-center text-[#D7E5EC] font-bold outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                        <button type="button" onClick={() => updateQuantity(idx, 1)} className="px-2 py-1 text-[#54E98A] hover:bg-[#354C56] rounded">+</button>
                                    </div>
                                </td>

                                <td className="py-3 px-4 text-right text-[#54E98A] font-semibold">
                                    {formatCurrency(item.price * item.quantity)}
                                </td>

                                <td className="py-3 px-4 text-center">
                                    <button type="button" onClick={() => removeItem(idx)} className="text-[#BBCBBB] hover:text-red-400">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {/* FILA DE BÚSQUEDA Y ESCANEO DE SKU */}
                        <tr className="bg-[#0b171b]">
                            <td className="py-3 px-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(true)}
                                    title="Buscar producto (F2)"
                                    className="p-1.5 bg-[#54E98A] text-[#003919] rounded-full hover:scale-105 transition-transform"
                                >
                                    <Plus size={16} />
                                </button>
                            </td>
                            <td colSpan={2} className="py-3 px-4">
                                <div className="flex items-center bg-[#041015] border border-[#54E98A] rounded-lg px-3 py-1.5">
                                    <Barcode className="text-[#54E98A] mr-2" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Escanear o ingresar SKU (Enter para agregar)..."
                                        value={skuInput}
                                        onChange={(e) => setSkuInput(e.target.value)}
                                        onKeyDown={async (e) => {
                                            if (e.key === "Enter" && skuInput.trim() !== "") {
                                                const codeToSearch = skuInput.trim().toUpperCase();
                                                const productsFound = await getProducts(codeToSearch);
                                                const exactProduct = productsFound.find(p => p.code.toUpperCase() === codeToSearch);

                                                if (exactProduct) {
                                                    handleAddProduct(exactProduct);
                                                } else {
                                                    alert(`El código "${codeToSearch}" no existe en el sistema.`);
                                                }
                                                setSkuInput("");
                                            }
                                        }}
                                        className="w-full bg-transparent text-xs text-[#D7E5EC] outline-none placeholder:text-[#6B7280]"
                                    />
                                </div>
                            </td>
                            <td className="py-3 px-4 text-center text-[#6B7280]">—</td>
                            <td className="py-3 px-4 text-center text-[#6B7280]">—</td>
                            <td className="py-3 px-4 text-center text-[#6B7280]">—</td>
                            <td className="py-3 px-4"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* BARRA INFERIOR */}
            <div className="flex justify-end items-center bg-[#142126] border border-[#3D4A3E] rounded-xl p-6">
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="block text-xs uppercase text-[#BBCBBB]">TOTAL A PAGAR</span>
                        <span className="text-2xl font-bold text-[#54E98A]">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleCompleteSale}
                        className="flex items-center gap-2 px-6 py-3 bg-[#54E98A] text-[#003919] font-bold rounded-xl hover:bg-[#43cd77] transition-all disabled:opacity-50"
                    >
                        <span>{loading ? "Procesando..." : "Completar Venta"}</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* MODALES */}
            <ProductSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectProduct={handleAddProduct}
                onCreateNewProduct={() => setIsSearchOpen(false)}
                showCreateButton={false}
            />

            <ClientSearchModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                onSelectClient={(client) => {
                    setHeader({
                        ...header,
                        clientId: client.id,
                        clientName: client.name,
                        clientDocument: client.document
                    });
                }}
            />
        </div>
    );
}