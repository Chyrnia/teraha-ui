"use client";
import { use } from "react";
import SupplierDetails from "@/components/suppliers/SupplierDetails.jsx";

export default function SupplierDetailPage({ params }) {
    const resolvedParams = use(params);
    return (
        <section className="p-8">
            <SupplierDetails id={resolvedParams.id} />
        </section>
    );
}