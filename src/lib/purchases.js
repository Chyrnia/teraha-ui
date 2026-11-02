

let mockPurchases = [
    {
        id: 1,
        invoiceNumber: "FAC-001",
        supplier: "Distribuidora Mayorista S.A.",
        date: "2026-10-25",
        total: 1500000,
        status: "Completado",
        items: [
            { code: "P001", description: "Neumático 195/65 R15", quantity: 4, cost: 300000 },
            { code: "P002", description: "Filtro de Aceite", quantity: 3, cost: 100000 }
        ]
    },
    {
        id: 2,
        invoiceNumber: "FAC-002",
        supplier: "Importadora del Este",
        date: "2026-10-27",
        total: 800000,
        status: "Pendiente",
        items: [
            { code: "P003", description: "Pastillas de Freno", quantity: 2, cost: 400000 }
        ]
    }
];

export async function getPurchases() {
    // Simula la llamada a una API
    return mockPurchases;
}

export async function getPurchaseById(id) {
    return mockPurchases.find(p => p.id === Number(id));
}

export async function createPurchase(newPurchase) {
    const purchase = {
        id: mockPurchases.length + 1,
        ...newPurchase,
        status: "Completado"
    };
    mockPurchases.push(purchase);
    return purchase;
}

export async function getSupplierCategories() {
    // Categorías o proveedores de ejemplo para filtros
    return ["Distribuidora Mayorista S.A.", "Importadora del Este"];
}

/*
// src/lib/purchases.js
const API_URL = "http://localhost:8080";

export async function createPurchaseInvoice(purchaseData) {
    const response = await fetch(`${API_URL}/purchases`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(purchaseData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar la compra");
    }

    return await response.json();
}

*/