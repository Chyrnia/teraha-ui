// src/components/purchases/QuickProductModal.jsx
"use client";

import { useState } from "react";
import { Boxes, CircleAlert, LoaderCircle, X } from "lucide-react";
import { createProduct } from "@/lib/products.js";

const INITIAL_PRODUCT = {
    code: "",
    description: "",
    price: "",
    margin: "",
};

const inputClass =
    "w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none transition placeholder:text-[#5F777D] focus:border-[#54E98A] focus:ring-2 focus:ring-[#54E98A]/10 disabled:opacity-60";

const labelClass =
    "mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]";

export default function QuickProductModal({ isOpen, onClose, onProductCreated }) {
    if (!isOpen) return null;

    const [product, setProduct] = useState(INITIAL_PRODUCT);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setProduct((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        // Payload limpio adaptado al backend (sin stock, sin cost, sin active)
        const payload = {
            code: product.code,
            description: product.description,
            price: Number(product.price),
            margin: Number(product.margin),
            supplierIds: [],
            categoryIds: []
        };

        try {
            const newProduct = await createProduct(payload);
            if (onProductCreated) {
                onProductCreated(newProduct);
            }
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo crear el producto express."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#3D4A3E] bg-[#142126] shadow-2xl">
                <header className="flex items-center justify-between border-b border-[#3D4A3E] bg-[#101D22] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                            <Boxes size={19} />
                        </div>
                        <h2 className="text-sm font-semibold text-white">
                            Nuevo Producto Express
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-[#7F9699] transition hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="code" className={labelClass}>
                            CÓDIGO
                        </label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            value={product.code}
                            onChange={handleChange}
                            placeholder="Ej. PROD-001"
                            required
                            disabled={isSubmitting}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className={labelClass}>
                            DESCRIPCIÓN
                        </label>
                        <input
                            id="description"
                            name="description"
                            type="text"
                            value={product.description}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                            required
                            disabled={isSubmitting}
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className={labelClass}>
                                PRECIO
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={product.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                                disabled={isSubmitting}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="margin" className={labelClass}>
                                MARGEN (%)
                            </label>
                            <input
                                id="margin"
                                name="margin"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={product.margin}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                                disabled={isSubmitting}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-400/[0.07] p-3 text-xs text-red-200"
                        >
                            <CircleAlert size={16} className="mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <footer className="flex items-center justify-end gap-3 pt-4 border-t border-[#3D4A3E]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg border border-[#3D4A3E] px-4 py-2 text-xs font-medium text-[#BBCBBB] transition hover:border-[#718A8F] hover:text-white"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#54E98A] px-4 py-2 text-xs font-semibold text-[#003919] transition hover:bg-[#70F0A0] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle size={15} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Crear producto"
                            )}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}