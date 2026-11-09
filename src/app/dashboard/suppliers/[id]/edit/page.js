"use client";
import { useState, useEffect, use } from "react";
import { getSupplierById } from "@/lib/suppliers.js";
import SupplierForm from "@/components/suppliers/SupplierForm.jsx";

export default function EditSupplierPage({ params }) {
    const resolvedParams = use(params);
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getSupplierById(resolvedParams.id);
                setSupplier(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [resolvedParams.id]);

    if (loading) return <div className="p-8 text-[#BBCBBB]">Cargando...</div>;

    return (
        <section className="p-8">
            <h1 className="text-2xl font-bold text-[#D7E5EC]">Editar Proveedor</h1>
            <SupplierForm supplier={supplier} mode="edit" />
        </section>
    );
}