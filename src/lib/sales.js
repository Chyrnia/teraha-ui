// src/lib/sales.js
import { authenticatedFetch } from "@/lib/auth.js";

export async function getSales(filters = {}, options = {}) {
    const safeFilters = typeof filters === "string" ? { search: filters } : (filters || {});
    const { search = "", page = 0 } = safeFilters;

    const params = new URLSearchParams({
        page: String(page)
    });

    const searchTerm = search ? String(search).trim() : "";
    if (searchTerm) {
        params.set("search", searchTerm);
    }

    const path = `/sales?${params}`;
    const json = await authenticatedFetch(path, options);
    
    return json;
}

export async function getSaleById(id) {
    const path = `/sales/${id}`;
    const json = await authenticatedFetch(path, {});
    return json;
}

export async function createSaleInvoice(saleData) {
    const options = {
        method: "POST",
        body: JSON.stringify(saleData)
    };

    const path = "/sales";
    const response = await authenticatedFetch(path, options);
    return response;
}

export async function cancelSale(id) {
    const options = {
        method: "DELETE"
    };
    const path = `/sales/${id}`;
    const json = await authenticatedFetch(path, options);
    return json;
}