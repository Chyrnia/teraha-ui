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