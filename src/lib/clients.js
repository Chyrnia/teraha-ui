// src/lib/clients.js
import { authenticatedFetch } from "@/lib/auth.js";

export async function getClients(filters = {}) {
    const safeFilters = typeof filters === "string" ? { search: filters } : (filters || {});
    const { search = "", page = 0 } = safeFilters;

    const params = new URLSearchParams({
        page: String(page)
    });

    const searchTerm = search ? String(search).trim() : "";
    if (searchTerm) {
        params.set("search", searchTerm);
    }

    const path = `/clients?${params}`;
    const json = await authenticatedFetch(path, {});
    
    // Spring Data Page suele devolver { content: [...], totalPages: ... } o un array directo
    return json;
}

export async function getClientById(id) {
    const path = `/clients/${id}`;
    return await authenticatedFetch(path, {});
}

export async function createClient(clientData) {
    const options = {
        method: "POST",
        body: JSON.stringify({
            name: clientData.name,
            document: clientData.document,
            address: clientData.address,
            email: clientData.email,
            phone: clientData.phone,
            birthDate: clientData.birthDate
        })
    };

    return await authenticatedFetch("/clients", options);
}