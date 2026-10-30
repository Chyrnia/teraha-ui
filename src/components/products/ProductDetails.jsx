
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    CircleAlert,
    Code,
    DollarSign,
    LoaderCircle,
    Package,
    Pencil,
    Percent,
    Warehouse,
} from "lucide-react";

import { getProductById } from "@/lib/products.js";
import { getSuppliers } from "@/lib/suppliers.js";

function formatNumber(value) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number.toLocaleString("es-PY", { maximumFractionDigits: 2 })
        : value;
}

function DetailCard({ icon: Icon, label, value, accent = false, detail }) {
    return (
        <div className="rounded-xl border border-[#354C56]/70 bg-[#08151A]/60 p-4">
            <div className="flex items-center gap-2 text-[#718A8F]">
                <Icon size={16} />
                <span className="text-xs font-semibold tracking-wide">
                    {label}
                </span>
            </div>

            <p
                className={`mt-3 text-xl font-semibold ${
                    accent ? "text-[#54E98A]" : "text-[#D7E5EC]"
                }`}
            >
                {value}
            </p>

            {detail && (
                <p className="mt-1 text-xs text-[#718A8F]">
                    {detail}
                </p>
            )}
        </div>
    );
}

export default function ProductDetails({ id }) {
    const [product, setProduct] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [supplierError, setSupplierError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function fetchProduct() {
            setIsLoading(true);
            setError("");
            setSupplierError("");
            setProduct(null);
            setSuppliers([]);

            try {
                if (!id) {
                    setError("Producto no encontrado.");
                    return;
                }

                const result = await getProductById(id);

                if (!result) {
                    setError("Producto no encontrado.");
                    return;
                }

                if (ignore) return;

                setProduct(result);

                const supplierIds = (result.supplierIds ?? []).map(Number);

                if (supplierIds.length > 0) {
                    try {
                        const allSuppliers = await getSuppliers();

                        if (!ignore) {
                            setSuppliers(
                                allSuppliers.filter((supplier) =>
                                    supplierIds.includes(Number(supplier.id))
                                )
                            );
                        }
                    } catch {
                        if (!ignore) {
                            setSupplierError(
                                "No se pudieron cargar los nombres de los proveedores."
                            );
                        }
                    }
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudo cargar el producto."
                    );
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        fetchProduct();

        return () => {
            ignore = true;
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="mt-6 flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-[#3D4A3E] bg-[#142126] text-sm text-[#8FA4A8]">
                <LoaderCircle
                    size={20}
                    className="animate-spin text-[#54E98A]"
                />
                Cargando información del producto...
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

    const stock = Number(product.stock ?? 0);
    const supplierIds = (product.supplierIds ?? []).map(Number);

    const stockAvailable = stock > 0;

    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#3D4A3E] bg-[#142126] shadow-xl shadow-black/10">

            {/* Product heading */}
            <header className="flex flex-col gap-5 border-b border-[#3D4A3E] bg-[#101D22]/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#54E98A]/20 bg-[#54E98A]/10 text-[#54E98A]">
                        <Package size={27} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-semibold tracking-[0.16em] text-[#54E98A]">
                                PRODUCTO #{product.id}
                            </span>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                                    stockAvailable
                                        ? "bg-[#54E98A]/10 text-[#54E98A]"
                                        : "bg-red-400/10 text-red-300"
                                }`}
                            >
                                {stockAvailable ? "Disponible" : "Sin stock"}
                            </span>
                        </div>

                        <h2 className="truncate text-xl font-semibold text-white sm:text-2xl">
                            {product.description}
                        </h2>

                        <p className="mt-1 text-sm text-[#8FA4A8]">
                            Código: {product.code}
                        </p>
                    </div>
                </div>

                <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#54E98A] px-4 py-2.5 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0]"
                >
                    <Pencil size={16} />
                    Editar producto
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">

                {/* Product information */}
                <section className="p-6 sm:p-8">
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-white">
                            Información general
                        </h3>

                        <p className="mt-1 text-xs text-[#7F9699]">
                            Características y valores del producto.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <DetailCard
                            icon={DollarSign}
                            label="PRECIO DE VENTA"
                            value={formatNumber(product.price)}
                            accent
                        />

                        <DetailCard
                            icon={DollarSign}
                            label="COSTO"
                            value={formatNumber(product.cost)}
                        />

                        <DetailCard
                            icon={Warehouse}
                            label="STOCK"
                            value={formatNumber(product.stock)}
                            detail={stockAvailable ? "Unidades disponibles" : "Sin unidades disponibles"}
                        />

                        <DetailCard
                            icon={Percent}
                            label="MARGEN"
                            value={`${formatNumber(product.margin)}%`}
                            accent
                        />
                    </div>

                    <div className="mt-6 rounded-xl border border-[#354C56]/70 bg-[#08151A]/40 p-4">
                        <div className="flex items-center gap-2 text-[#718A8F]">
                            <Code size={16} />
                            <span className="text-xs font-semibold tracking-wide">
                                CÓDIGO DE PRODUCTO
                            </span>
                        </div>

                        <p className="mt-2 font-mono text-sm tracking-wide text-[#D7E5EC]">
                            {product.code}
                        </p>
                    </div>
                </section>

                {/* Supplier associations */}
                <section className="border-t border-[#3D4A3E] bg-[#101D22]/40 p-6 sm:p-8 lg:border-t-0 lg:border-l">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                            <Building2 size={21} />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                Proveedores asociados
                            </h3>

                            <p className="mt-1 text-xs text-[#7F9699]">
                                Proveedores de este producto.
                            </p>
                        </div>
                    </div>

                    <div className="mb-5 flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-wide text-[#BBCBBB]">
                            ASOCIACIONES
                        </span>

                        <span className="rounded-full bg-[#54E98A]/10 px-2.5 py-1 text-xs font-medium text-[#54E98A]">
                            {supplierIds.length}
                        </span>
                    </div>

                    {supplierError ? (
                        <p className="rounded-lg border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-200">
                            {supplierError}
                        </p>
                    ) : supplierIds.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#354C56] p-6 text-center">
                            <Building2
                                size={24}
                                className="mx-auto text-[#5F777D]"
                            />

                            <p className="mt-3 text-sm text-[#BBCBBB]">
                                Sin proveedores asociados
                            </p>

                            <p className="mt-1 text-xs text-[#718A8F]">
                                Este producto todavía no tiene proveedores registrados.
                            </p>
                        </div>
                    ) : suppliers.length > 0 ? (
                        <div className="space-y-2">
                            {suppliers.map((supplier) => (
                                <div
                                    key={supplier.id}
                                    className="flex items-center gap-3 rounded-xl border border-[#354C56]/70 bg-[#08151A]/60 p-3.5"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#54E98A]/10 text-[#54E98A]">
                                        <Building2 size={17} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-[#D7E5EC]">
                                            {supplier.name}
                                        </p>

                                        {supplier.document && (
                                            <p className="mt-0.5 text-xs text-[#718A8F]">
                                                {supplier.document}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-[#354C56]/70 bg-[#08151A]/60 p-4">
                            <p className="text-sm text-[#BBCBBB]">
                                No se encontraron los datos de los proveedores asociados.
                            </p>

                            <p className="mt-2 text-xs text-[#718A8F]">
                                IDs: {supplierIds.join(", ")}
                            </p>
                        </div>
                    )}
                </section>
            </div>

            {/* Footer */}
            <footer className="flex justify-start border-t border-[#3D4A3E] bg-[#101D22]/70 px-6 py-5 sm:px-8">
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#3D4A3E] px-4 py-2.5 text-sm font-medium text-[#BBCBBB] transition hover:border-[#718A8F] hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Volver a productos
                </Link>
            </footer>
        </div>
    );
}

