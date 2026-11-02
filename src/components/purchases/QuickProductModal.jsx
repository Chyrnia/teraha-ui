// src/components/purchases/QuickProductModal.jsx
"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { createProduct } from "@/lib/products"; // <- Importamos nuestro servicio conectado al Gateway

export default function QuickProductModal({ isOpen, onClose, onProductCreated }) {
    const [form, setForm] = useState({
        code: "",
        description: "",
        price: "",
        cost: "",
        margin: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleCostChange = (val) => {
        const cost = Number(val);
        const margin = Number(form.margin);
        let price = form.price;

        if (cost > 0 && margin > 0) {
            price = Math.round(cost * (1 + margin / 100));
        }
        setForm(prev => ({ ...prev, cost: val, price }));
    };

    const handlePriceChange = (val) => {
        const price = Number(val);
        const cost = Number(form.cost);
        let margin = form.margin;

        if (cost > 0 && price >= cost) {
            margin = Math.round(((price - cost) / cost) * 100);
        }
        setForm(prev => ({ ...prev, price: val, margin }));
    };

    const handleMarginChange = (val) => {
        const margin = Number(val);
        const cost = Number(form.cost);
        let price = form.price;

        if (cost > 0 && margin >= 0) {
            price = Math.round(cost * (1 + margin / 100));
        }
        setForm(prev => ({ ...prev, margin: val, price }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const price = Number(form.price);
        const cost = Number(form.cost);

        // 1. Validación de seguridad en el frontend (Precio menor a Costo)
        if (price < cost) {
            setError("El precio de venta no puede ser menor al costo del producto.");
            return;
        }

        // 2. Mensaje de confirmación previo a guardar y enviar al backend
        const confirmSave = window.confirm(
            `¿Está seguro de que desea guardar el producto "${form.description.toUpperCase()}" (${form.code.toUpperCase()}) con Costo ₲${cost.toLocaleString()} y Precio ₲${price.toLocaleString()}?`
        );

        if (!confirmSave) return; // Si cancela, se mantiene en el modal

        setLoading(true);

        try {
            // 3. Estructura que espera el ProductDTO de tu backend (vía Gateway)
            const productPayload = {
                code: form.code.toUpperCase(),
                description: form.description,
                stock: 0, // El stock inicial se alimenta al registrar la compra
                price: price,
                cost: cost,
                margin: Number(form.margin || 0)
            };

            // Llamada al microservicio a través del servicio centralizado
            const createdProduct = await createProduct(productPayload);

            // 4. Notificamos al componente padre que ya se guardó y añadimos a la compra
            onProductCreated(createdProduct);
            setForm({ code: "", description: "", price: "", cost: "", margin: "" });
            onClose();

        } catch (err) {
            setError(err.message || "Error al registrar el producto en el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-[#D7E5EC]">Nuevo Producto Express</h3>
                        <p className="text-xs text-[#BBCBBB]">Registro rápido para añadir a la compra.</p>
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
                            <label className="text-xs text-[#BBCBBB]">CÓDIGO / SKU</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: JMK-109"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">COSTO (₲)</label>
                            <input
                                type="number"
                                required
                                placeholder="0"
                                value={form.cost}
                                onChange={(e) => handleCostChange(e.target.value)}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">DESCRIPCIÓN</label>
                            <input
                                type="text"
                                required
                                placeholder="Nombre del artículo"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">MARGEN (%)</label>
                            <input
                                type="number"
                                placeholder="Ej: 30"
                                value={form.margin}
                                onChange={(e) => handleMarginChange(e.target.value)}
                                className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#BBCBBB]">PRECIO VENTA (₲)</label>
                            <input
                                type="number"
                                required
                                placeholder="0"
                                value={form.price}
                                onChange={(e) => handlePriceChange(e.target.value)}
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
                            disabled={loading}
                            className="px-4 py-2 rounded-md bg-[#54E98A] text-[#003919] font-semibold hover:bg-[#43cd77] disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar y Agregar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}