
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Archive,
    AlertTriangle,
    Eye,
    LoaderCircle,
    X,
} from "lucide-react";

import { hasRole } from "@/lib/auth.js";
import { deleteProduct } from "@/lib/products.js";

export default function ProductList({
    products,
    page,
    totalPages,
    onPageChange,
    loading,
    onProductDeactivated,
}) {
    const [isSysadmin, setIsSysadmin] = useState(false);
    const [productToDeactivate, setProductToDeactivate] = useState(null);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [deactivationError, setDeactivationError] = useState("");

    useEffect(() => {
        setIsSysadmin(hasRole("ROLE_SYSADMIN"));
    }, []);

    async function handleDeactivate() {
        if (!productToDeactivate || isDeactivating) return;

        setIsDeactivating(true);
        setDeactivationError("");

        try {
            await deleteProduct(productToDeactivate.id);

            const deletedId = productToDeactivate.id;

            setProductToDeactivate(null);
            onProductDeactivated(deletedId);

        } catch (error) {
            setDeactivationError(
                error instanceof Error
                    ? error.message
                    : "No se pudo desactivar el producto."
            );
        } finally {
            setIsDeactivating(false);
        }
    }

    return (
        <>
            <div
                className="relative mt-6"
                aria-busy={loading}
            >
                <table
                    className={`w-full border border-[#3D4A3E] border-separate border-spacing-0 rounded-xl overflow-hidden bg-[#142126] transition-opacity ${
                        loading ? "opacity-40" : ""
                    }`}
                >
                    <colgroup>
                        <col />
                        <col />
                        <col />
                        <col />
                        <col className="w-24" />
                        <col className="w-28" />
                    </colgroup>

                    <thead className="[&_th]:px-4 [&_th]:py-3">
                        <tr className="bg-[#101D22] text-[#BBCBBB]">
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Margen</th>
                            <th>Acción</th>
                        </tr>
                    </thead>

                    <tbody className="text-[#BBCBBB] [&_td]:px-4 [&_td]:py-3">
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-t border-[#3D4A3E]/50 transition hover:bg-[#1A2C32]"
                            >
                                <td>{product.code}</td>
                                <td>{product.description}</td>
                                <td className="text-right">
                                    {product.price}
                                </td>
                                <td className="text-center">
                                    {product.stock}
                                </td>
                                <td className="text-center text-[#54E98A]">
                                    {product.margin}%
                                </td>

                                <td>
                                    <div className="flex items-center justify-center gap-3">
                                        <Link
                                            href={`/dashboard/products/${product.id}`}
                                            className="inline-flex rounded-md p-1.5 transition hover:bg-[#54E98A]/10 hover:text-[#54E98A]"
                                            aria-label="Ver producto"
                                            title="Ver producto"
                                        >
                                            <Eye size={18} />
                                        </Link>

                                        {isSysadmin && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeactivationError("");
                                                    setProductToDeactivate(product);
                                                }}
                                                disabled={loading || isDeactivating}
                                                className="inline-flex rounded-md p-1.5 text-[#8FA4A8] transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
                                                aria-label="Desactivar producto"
                                                title="Desactivar producto"
                                            >
                                                <Archive size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {products.length === 0 && !loading && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-12 text-center text-sm text-[#718A8F]"
                                >
                                    No se encontraron productos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {loading && (
                    <div
                        className="absolute inset-0 flex items-center justify-center gap-3 rounded-xl bg-[#08151A]/30 backdrop-blur-[1px]"
                        role="status"
                    >
                        <LoaderCircle
                            className="animate-spin text-[#54E98A]"
                            size={22}
                        />
                        <span className="text-sm text-[#D7E5EC]">
                            Cargando productos...
                        </span>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <button
                    type="button"
                    disabled={loading || page === 0}
                    onClick={() => onPageChange(page - 1)}
                    className="rounded-lg border border-[#3D4A3E] px-4 py-2 text-sm text-[#BBCBBB] transition hover:border-[#718A8F] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Anterior
                </button>

                <span className="text-sm text-[#8FA4A8]">
                    Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
                </span>

                <button
                    type="button"
                    disabled={loading || page + 1 >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="rounded-lg border border-[#3D4A3E] px-4 py-2 text-sm text-[#BBCBBB] transition hover:border-[#718A8F] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Siguiente
                </button>
            </div>

            {/* Deactivation confirmation */}
            {productToDeactivate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget &&
                            !isDeactivating
                        ) {
                            setProductToDeactivate(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="deactivation-title"
                        className="w-full max-w-md rounded-2xl border border-[#3D4A3E] bg-[#142126] p-6 shadow-2xl"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                                <AlertTriangle size={22} />
                            </div>

                            <button
                                type="button"
                                onClick={() => setProductToDeactivate(null)}
                                disabled={isDeactivating}
                                aria-label="Cerrar"
                                className="rounded-md p-1.5 text-[#718A8F] transition hover:text-white disabled:opacity-40"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <h2
                            id="deactivation-title"
                            className="mt-5 text-lg font-semibold text-white"
                        >
                            ¿Desactivar producto?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#8FA4A8]">
                            Estás por desactivar{" "}
                            <span className="font-medium text-[#D7E5EC]">
                                {productToDeactivate.description}
                            </span>
                            {" "}({productToDeactivate.code}).
                            El producto dejará de aparecer en el catálogo
                            de productos activos.
                        </p>

                        {deactivationError && (
                            <p
                                role="alert"
                                className="mt-4 rounded-lg border border-red-400/20 bg-red-400/[0.07] p-3 text-sm text-red-200"
                            >
                                {deactivationError}
                            </p>
                        )}

                        <div className="mt-7 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setProductToDeactivate(null)}
                                disabled={isDeactivating}
                                className="rounded-lg border border-[#3D4A3E] px-4 py-2.5 text-sm text-[#BBCBBB] transition hover:border-[#718A8F] disabled:opacity-40"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleDeactivate}
                                disabled={isDeactivating}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-400 px-4 py-2.5 text-sm font-semibold text-[#241010] transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeactivating ? (
                                    <>
                                        <LoaderCircle
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Desactivando...
                                    </>
                                ) : (
                                    "Desactivar"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

