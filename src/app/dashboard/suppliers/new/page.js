"use client";
import SupplierForm from "@/components/suppliers/SupplierForm.jsx";

export default function NewSupplierPage() {
    return (
        <section className="p-8">
            <h1 className="text-2xl font-bold text-[#D7E5EC]">Nuevo Proveedor</h1>
            <SupplierForm mode="create" />
        </section>
    );
}