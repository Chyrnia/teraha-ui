import { authenticatedFetch } from "@/lib/auth.js";

export async function getSuppliers(filters = {}, options = {}) {
    const safeFilters = typeof filters === "string" ? { search: filters } : (filters || {});
    const { search = "", page = 0 } = safeFilters;

    const params = new URLSearchParams({
        page: String(page)
    });

    const searchTerm = search ? String(search).trim() : "";
    if (searchTerm) {
        params.set("search", searchTerm);
    }

    const path = `/suppliers?${params}`;
    return await authenticatedFetch(path, options);
}

export async function getAllSuppliers(filters = {}, options = {}) {
    const safeFilters =
        typeof filters === "string"
            ? { search: filters }
            : (filters || {});

    const { search = "" } = safeFilters;

    const suppliers = [];
    let page = 0;
    let lastPage = false;

    while (!lastPage) {
        const params = new URLSearchParams({
            page: String(page)
        });

        const searchTerm = String(search).trim();

        if (searchTerm) {
            params.set("search", searchTerm);
        }

        const response = await authenticatedFetch(
            `/suppliers?${params}`,
            options
        );

        if (!Array.isArray(response.content)) {
            throw new Error("Respuesta de proveedores inesperada.");
        }

        suppliers.push(...response.content);

        lastPage = response.last;
        page++;
    }

    return suppliers;
}

export async function createSupplier(supplierData) {
    const options = {
        method: "POST",
        body: JSON.stringify({
            name: supplierData.name,
            document: supplierData.document,
            timbrado: supplierData.timbrado,
            address: supplierData.address,
            email: supplierData.email,
            phone: supplierData.phone
        })
    };

    return await authenticatedFetch("/suppliers", options);
}


export async function getSupplierById(id) {
    const path = `/suppliers/${id}`;
    return await authenticatedFetch(path, {});
}

export async function updateSupplier(id, supplierData) {
    const options = {
        method: "PATCH",
        body: JSON.stringify({
            name: supplierData.name,
            document: supplierData.document,
            timbrado: supplierData.timbrado,
            address: supplierData.address,
            email: supplierData.email,
            phone: supplierData.phone
        })
    };

    return await authenticatedFetch(`/suppliers/${id}`, options);
}
