// src/lib/suppliers.js
const API_URL = "http://localhost:8080";

export async function getSuppliers(search = "") {
    try {
        const url = search ? `${API_URL}/suppliers?search=${encodeURIComponent(search)}` : `${API_URL}/suppliers`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) throw new Error("Error al obtener los proveedores");

        const data = await response.json();
        return data.content || data;
    } catch (error) {
        console.error("Error en getSuppliers:", error);
        return [];
    }
}

export async function createSupplier(supplierData) {
    const response = await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            name: supplierData.name,
            document: supplierData.document,
            timbrado: supplierData.timbrado,
            address: supplierData.address,
            email: supplierData.email,
            phone: supplierData.phone
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el proveedor");
    }

    return await response.json();
}