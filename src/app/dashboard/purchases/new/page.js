// src/app/dashboard/purchases/new/page.js

import PurchaseForm from "@/components/purchases/PurchaseForm";

export const metadata = {
    title: "Nueva Compra | Teraha",
    description: "Registro de nueva factura de compra de proveedores",
};

export default function NewPurchasePage() {
    return <PurchaseForm />;
}