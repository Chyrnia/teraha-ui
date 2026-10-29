// src/components/purchases/PurchaseForm.jsx
"use client";
import { useState, useEffect } from "react";
import { Trash2, Plus, Barcode, Search, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductSearchModal from "./ProductSearchModal";
import SupplierSearchModal from "./SupplierSearchModal"; // <- Importamos el modal de proveedores

function QuickProductModal({ isOpen, onClose, onProductCreated }) {
    const [form, setForm] = useState({
        code: "",
        category: "",
        description: "",
        price: "",
        cost: "",
        stock: "",
        margin: ""
    });

    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(current => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const price = Number(form.price);
        const cost = Number(form.cost);

        // Validación Frontend: El precio de venta debe ser mayor o igual al costo
        if (price < cost) {
            setError("El precio de venta no puede ser menor al costo del producto.");
            return;
        }

        const newProd = {
            id: Date.now(),
            code: form.code.toUpperCase(),
            category: form.category,
            description: form.description,
            price: price,
            cost: cost,
            stock: Number(form.stock || 0),
            margin: Number(form.margin || 0)
        };

        onProductCreated(newProd);
        setForm({ code: "", category: "", description: "", price: "", cost: "", stock: "", margin: "" });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-[#D7E5EC]">Agregar Producto Express</h3>
                        <p className="text-xs text-[#BBCBBB]">Completa los datos del nuevo producto.</p>
                    </div>
                    <button onClick={onClose} className="text-[#BBCBBB] hover:text-white"><X size={20} /></button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-400 text-xs">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">CÓDIGO</label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                value={form.code}
                                onChange={handleChange}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">CATEGORÍA</label>
                            <input
                                id="category"
                                name="category"
                                type="text"
                                required
                                value={form.category}
                                onChange={handleChange}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">DESCRIPCIÓN</label>
                            <input
                                id="description"
                                name="description"
                                type="text"
                                required
                                value={form.description}
                                onChange={handleChange}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">PRECIO</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                required
                                value={form.price}
                                onChange={handleChange}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">COSTO</label>
                            <input
                                id="cost"
                                name="cost"
                                type="number"
                                required
                                value={form.cost}
                                onChange={handleChange}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">STOCK</label>
                            <input
                                id="stock"
                                name="stock"
                                type="number"
                                required
                                value={form.stock}
                                onChange={handleChange}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">MARGEN (%)</label>
                            <input
                                id="margin"
                                name="margin"
                                type="number"
                                required
                                value={form.margin}
                                onChange={handleChange}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border border-[#3D4A3E] text-[#BBCBBB]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-[#54E98A] text-[#003919] font-semibold"
                        >
                            Crear Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function PurchaseForm() {
    const router = useRouter();

    const [header, setHeader] = useState({
        supplier: "",
        ruc: "",
        seller: "Retail Manager",
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: "",
        paymentCondition: "Contado"
    });

    const [items, setItems] = useState([]);
    const [skuInput, setSkuInput] = useState("");

    // Control de Modales
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false); // <- Estado modal proveedor

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "F2") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleAddProduct = (product) => {
        const existingIndex = items.findIndex(i => i.code === product.code);
        if (existingIndex >= 0) {
            const updated = [...items];
            updated[existingIndex].quantity += 1;
            setItems(updated);
        } else {
            setItems([
                ...items,
                {
                    id: product.id,
                    code: product.code,
                    description: product.description,
                    cost: Number(product.cost || product.price || 0),
                    quantity: 1
                }
            ]);
        }
        setSkuInput("");
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

    const handleNewPurchaseClick = () => {
        if (items.length > 0) {
            const confirmDiscard = window.confirm("Tienes una compra en proceso con artículos cargados. ¿Deseas descartarla y empezar una nueva?");
            if (!confirmDiscard) return;
        }
        setItems([]);
        setHeader({
            supplier: "",
            ruc: "",
            seller: "Retail Manager",
            date: new Date().toISOString().split('T')[0],
            invoiceNumber: "",
            paymentCondition: "Contado"
        });
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

    return (
        <div className="w-full p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#D7E5EC]">Nueva Compra</h1>
                <button
                    type="button"
                    onClick={handleNewPurchaseClick}
                    className="px-4 py-2 bg-[#354C56] text-[#A4BCC7] hover:text-[#54E98A] text-xs font-semibold rounded-md border border-[#3D4A3E] transition-colors"
                >
                    Reiniciar / Nueva Compra
                </button>
            </div>

            {/* DATOS DEL PROVEEDOR Y FACTURA */}
            <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-6 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">PROVEEDOR</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={header.supplier}
                                onChange={(e) => setHeader({ ...header, supplier: e.target.value })}
                                className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                            {/* Botón de lupa que abre el buscador de proveedores */}
                            <button
                                type="button"
                                onClick={() => setIsSupplierModalOpen(true)}
                                className="bg-[#54E98A] text-[#003919] p-2 rounded-md hover:bg-[#43cd77] transition-colors"
                                title="Buscar o crear proveedor"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">CI / RUC</label>
                        <input
                            type="text"
                            placeholder="Ingrese CI o RUC"
                            value={header.ruc}
                            onChange={(e) => setHeader({ ...header, ruc: e.target.value })}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">VENDEDOR</label>
                        <input
                            type="text"
                            readOnly
                            value={header.seller}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#BBCBBB] outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">FECHA</label>
                        <input
                            type="date"
                            value={header.date}
                            onChange={(e) => setHeader({ ...header, date: e.target.value })}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">Nº FACTURA</label>
                        <input
                            type="text"
                            placeholder="Autogenerado"
                            value={header.invoiceNumber}
                            onChange={(e) => setHeader({ ...header, invoiceNumber: e.target.value })}
                            className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBCBBB] mb-2">CONDICIÓN DE VENTA</label>
                        <div className="flex gap-6 items-center mt-3 text-sm text-[#D7E5EC]">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="condition"
                                    checked={header.paymentCondition === "Contado"}
                                    onChange={() => setHeader({ ...header, paymentCondition: "Contado" })}
                                    className="accent-[#54E98A]"
                                />
                                <span>Contado</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="condition"
                                    checked={header.paymentCondition === "Crédito"}
                                    onChange={() => setHeader({ ...header, paymentCondition: "Crédito" })}
                                    className="accent-[#54E98A]"
                                />
                                <span>Crédito</span>
                            </label>
                        </div>
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
                        <th className="py-3 px-4 w-36 text-right">COSTO</th>
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
                            <td className="py-3 px-4 text-right">₲ {item.cost.toLocaleString()}</td>
                            <td className="py-3 px-4 text-center">
                                <div className="inline-flex items-center bg-[#041015] border border-[#3D4A3E] rounded-md">
                                    <button onClick={() => updateQuantity(idx, -1)} className="px-2 py-1 text-[#54E98A] hover:bg-[#354C56]">-</button>
                                    <span className="px-3 text-[#D7E5EC] font-bold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(idx, 1)} className="px-2 py-1 text-[#54E98A] hover:bg-[#354C56]">+</button>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-right text-[#54E98A] font-semibold">
                                ₲ {(item.cost * item.quantity).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center">
                                <button onClick={() => removeItem(idx)} className="text-[#BBCBBB] hover:text-red-400">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* FILA DINÁMICA DE ENTRADA */}
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
                                    placeholder="Escanear o ingresar SKU (Enter para agregar, F2 para buscar)..."
                                    value={skuInput}
                                    onChange={(e) => setSkuInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && skuInput.trim() !== "") {
                                            handleAddProduct({
                                                id: Date.now(),
                                                code: skuInput.toUpperCase(),
                                                description: `Artículo ${skuInput.toUpperCase()}`,
                                                cost: 150000
                                            });
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

            {/* BARRA INFERIOR DE TOTAL Y CONFIRMACIÓN */}
            <div className="flex justify-between items-center bg-[#142126] border border-[#3D4A3E] rounded-xl p-6">
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/products")}
                    className="px-4 py-2 text-xs border border-[#3D4A3E] rounded-md text-[#BBCBBB] hover:text-white"
                >
                    Revisar Stock
                </button>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="block text-xs uppercase text-[#BBCBBB]">TOTAL A PAGAR</span>
                        <span className="text-2xl font-bold text-[#54E98A]">
							₲ {totalAmount.toLocaleString()}
						</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => alert("¡Compra registrada correctamente!")}
                        className="flex items-center gap-2 px-6 py-3 bg-[#54E98A] text-[#003919] font-bold rounded-xl hover:bg-[#43cd77] transition-all"
                    >
                        <span>Comprar</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* MODALES DE PRODUCTOS */}
            <ProductSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectProduct={handleAddProduct}
                onCreateNewProduct={() => {
                    setIsSearchOpen(false);
                    setIsQuickCreateOpen(true);
                }}
            />

            <QuickProductModal
                isOpen={isQuickCreateOpen}
                onClose={() => setIsQuickCreateOpen(false)}
                onProductCreated={(newProd) => {
                    handleAddProduct(newProd);
                }}
            />

            {/* MODAL DE PROVEEDORES */}
            <SupplierSearchModal
                isOpen={isSupplierModalOpen}
                onClose={() => setIsSupplierModalOpen(false)}
                onSelectSupplier={(supplier) => {
                    setHeader({
                        ...header,
                        supplier: supplier.name,
                        ruc: supplier.ruc
                    });
                }}
            />
        </div>
    );
}