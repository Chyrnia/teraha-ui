
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Boxes,
    Building2,
    CircleAlert,
    LoaderCircle,
    Search,
    X,
} from "lucide-react";

import { createProduct, updateProduct } from "@/lib/products.js";
import { getSuppliers } from "@/lib/suppliers.js";

const INITIAL_PRODUCT = {
    code: "",
    description: "",
    price: "",
    margin: "",
    supplierIds: [],
};

const inputClass =
    "w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none transition placeholder:text-[#5F777D] focus:border-[#54E98A] focus:ring-2 focus:ring-[#54E98A]/10 disabled:opacity-60";

const labelClass =
    "mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]";

export default function ProductForm({
    product: initialProduct,
    mode = "create",
}) {
    const router = useRouter();

    const [product, setProduct] = useState(() => ({
        ...INITIAL_PRODUCT,
        ...initialProduct,
        price: initialProduct?.price ?? "",
        margin: initialProduct?.margin ?? "",
        supplierIds: (initialProduct?.supplierIds ?? []).map(Number),
    }));

    const [suppliers, setSuppliers] = useState([]);
    const [supplierSearch, setSupplierSearch] = useState("");
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);
    const [supplierError, setSupplierError] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchSuppliers() {
            try {
                setLoadingSuppliers(true);
                setSupplierError("");

                const result = await getSuppliers();

                if (!cancelled) {
                    setSuppliers(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setSupplierError("No se pudieron cargar los proveedores.");
                }
            } finally {
                if (!cancelled) {
                    setLoadingSuppliers(false);
                }
            }
        }

        fetchSuppliers();

        return () => {
            cancelled = true;
        };
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;

        setProduct((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleSupplierToggle(id, checked) {
        setProduct((current) => ({
            ...current,
            supplierIds: checked
                ? [...current.supplierIds, id]
                : current.supplierIds.filter((supplierId) => supplierId !== id),
        }));
    }

    function removeSupplier(id) {
        setProduct((current) => ({
            ...current,
            supplierIds: current.supplierIds.filter(
                (supplierId) => supplierId !== id
            ),
        }));
    }

    const selectedSuppliers = suppliers.filter((supplier) =>
        product.supplierIds.includes(Number(supplier.id))
    );

    const filteredSuppliers = suppliers.filter((supplier) => {
        const query = supplierSearch.trim().toLowerCase();

        return (
            supplier.name.toLowerCase().includes(query) ||
            (supplier.document ?? "").toLowerCase().includes(query)
        );
    });

    async function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        const payload = {
            ...product,
            price: Number(product.price),
            margin: Number(product.margin),
            supplierIds: product.supplierIds,
        };

        try {
            if (mode === "edit") {
                await updateProduct(product.id, payload);
            } else {
                await createProduct(payload);
            }

            router.push("/dashboard/products");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el producto."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 overflow-hidden rounded-2xl border border-[#3D4A3E] bg-[#142126] shadow-xl shadow-black/10"
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">

                {/* Product information */}
                <section className="p-6 sm:p-8">
                    <div className="mb-7 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                            <Boxes size={21} />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-white">
                                Información del producto
                            </h2>
                            <p className="mt-0.5 text-xs text-[#7F9699]">
                                Datos generales y comerciales.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
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
                                placeholder="Nombre o descripción del producto"
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
                    </div>
                </section>

                {/* Supplier selection */}
                <section className="border-t border-[#3D4A3E] bg-[#101D22]/50 p-6 sm:p-8 lg:border-t-0 lg:border-l">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                            <Building2 size={21} />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-white">
                                Proveedores
                            </h2>
                            <p className="mt-0.5 text-xs text-[#7F9699]">
                                Asociá uno o varios proveedores.
                            </p>
                        </div>
                    </div>

                    {/* Selected suppliers */}
                    <div className="mb-5">
                        <div className="mb-3 flex items-center justify-between">
                            <span className={labelClass}>
                                SELECCIONADOS
                            </span>

                            <span className="rounded-full bg-[#54E98A]/10 px-2.5 py-1 text-xs font-medium text-[#54E98A]">
                                {product.supplierIds.length}
                            </span>
                        </div>

                        {selectedSuppliers.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedSuppliers.map((supplier) => (
                                    <span
                                        key={supplier.id}
                                        className="inline-flex items-center gap-2 rounded-lg border border-[#54E98A]/20 bg-[#54E98A]/[0.07] px-3 py-2 text-xs text-[#D7E5EC]"
                                    >
                                        {supplier.name}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeSupplier(Number(supplier.id))
                                            }
                                            aria-label={`Quitar ${supplier.name}`}
                                            disabled={isSubmitting}
                                            className="text-[#7F9699] transition hover:text-white"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="rounded-lg border border-dashed border-[#354C56] px-4 py-4 text-center text-xs text-[#718A8F]">
                                Todavía no hay proveedores seleccionados.
                            </p>
                        )}
                    </div>

                    {/* Supplier search */}
                    <label htmlFor="supplier-search" className={labelClass}>
                        DISPONIBLES
                    </label>

                    <div className="relative mb-3">
                        <Search
                            size={17}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718A8F]"
                        />

                        <input
                            id="supplier-search"
                            type="search"
                            value={supplierSearch}
                            onChange={(e) => setSupplierSearch(e.target.value)}
                            placeholder="Buscar proveedor..."
                            disabled={loadingSuppliers || isSubmitting}
                            className={`${inputClass} pl-10`}
                        />
                    </div>

                    <div
                        className="max-h-64 overflow-y-auto rounded-xl border border-[#354C56] bg-[#08151A]/70"
                        aria-busy={loadingSuppliers}
                    >
                        {loadingSuppliers ? (
                            <div className="flex items-center justify-center gap-2 p-8 text-sm text-[#8FA4A8]">
                                <LoaderCircle
                                    size={17}
                                    className="animate-spin text-[#54E98A]"
                                />
                                Cargando proveedores...
                            </div>
                        ) : supplierError ? (
                            <p className="p-5 text-center text-sm text-red-300">
                                {supplierError}
                            </p>
                        ) : filteredSuppliers.length === 0 ? (
                            <p className="p-5 text-center text-sm text-[#718A8F]">
                                No se encontraron proveedores.
                            </p>
                        ) : (
                            <div className="divide-y divide-[#354C56]/50">
                                {filteredSuppliers.map((supplier) => {
                                    const id = Number(supplier.id);
                                    const checked =
                                        product.supplierIds.includes(id);

                                    return (
                                        <label
                                            key={supplier.id}
                                            className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-[#142126] ${
                                                checked
                                                    ? "bg-[#54E98A]/[0.04]"
                                                    : ""
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) =>
                                                    handleSupplierToggle(
                                                        id,
                                                        e.target.checked
                                                    )
                                                }
                                                disabled={isSubmitting}
                                                className="h-4 w-4 shrink-0 accent-[#54E98A]"
                                            />

                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm text-[#D7E5EC]">
                                                    {supplier.name}
                                                </span>

                                                {supplier.document && (
                                                    <span className="mt-0.5 block text-xs text-[#718A8F]">
                                                        {supplier.document}
                                                    </span>
                                                )}
                                            </span>

                                            {checked && (
                                                <span className="text-xs font-medium text-[#54E98A]">
                                                    Seleccionado
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Form error */}
            {error && (
                <div
                    role="alert"
                    className="mx-6 flex items-start gap-3 rounded-lg border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-200 sm:mx-8"
                >
                    <CircleAlert size={18} className="mt-0.5 shrink-0" />
                    {error}
                </div>
            )}

            {/* Actions */}
            <footer className="flex flex-col-reverse gap-3 border-t border-[#3D4A3E] bg-[#101D22]/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/products")}
                    disabled={isSubmitting}
                    className="rounded-lg border border-[#3D4A3E] px-5 py-2.5 text-sm font-medium text-[#BBCBBB] transition hover:border-[#718A8F] hover:text-white disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting || loadingSuppliers}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#54E98A] px-5 py-2.5 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircle size={17} className="animate-spin" />
                            Guardando...
                        </>
                    ) : mode === "edit" ? (
                        "Guardar cambios"
                    ) : (
                        "Crear producto"
                    )}
                </button>
            </footer>
        </form>
    );
}

