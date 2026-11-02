
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CircleAlert,
    LoaderCircle,
} from "lucide-react";

import { getProductById } from "@/lib/products.js";
import ProductForm from "@/components/products/ProductForm.jsx";

export default function EditProductClient({ id }) {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchProduct() {
            setIsLoading(true);
            setError("");

            try {
                const result = await getProductById(id);

                if (!cancelled) {
                    if (!result) {
                        setError("Producto no encontrado.");
                    } else {
                        setProduct(result);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudo cargar el producto."
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchProduct();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="mt-6 flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-[#3D4A3E] bg-[#142126] text-sm text-[#8FA4A8]">
                <LoaderCircle
                    size={20}
                    className="animate-spin text-[#54E98A]"
                />
                Cargando producto...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="mt-6 rounded-2xl border border-[#3D4A3E] bg-[#142126] p-8">
                <div className="flex items-start gap-3">
                    <CircleAlert
                        size={21}
                        className="mt-0.5 shrink-0 text-red-300"
                    />

                    <div>
                        <h2 className="font-semibold text-white">
                            No se pudo cargar el producto
                        </h2>

                        <p className="mt-2 text-sm text-[#A4BCC7]">
                            {error || "Producto no encontrado."}
                        </p>
                    </div>
                </div>

                <Link
                    href="/dashboard/products"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#54E98A] px-4 py-2.5 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0]"
                >
                    <ArrowLeft size={16} />
                    Volver a productos
                </Link>
            </div>
        );
    }

    return (
        <ProductForm
            product={product}
            mode="edit"
        />
    );
}

