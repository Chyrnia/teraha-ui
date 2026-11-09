// src/lib/users.js
import { authenticatedFetch } from "@/lib/auth.js";

export async function getUsers(filters = {}, options = {}) {
    const safeFilters = typeof filters === "string" ? { search: filters } : (filters || {});
    const { search = "", page = 0 } = safeFilters;

    const params = new URLSearchParams({
        page: String(page)
    });

    const searchTerm = search ? String(search).trim() : "";
    if (searchTerm) {
        params.set("search", searchTerm);
    }

    const path = `/users?${params}`;
    return await authenticatedFetch(path, options);
}

export async function getUserById(id, options = {}) {
    const path = `/users/${id}`;
    return await authenticatedFetch(path, options);
}

export async function createUser(userData) {
    const options = {
        method: "POST",
        body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            roles: userData.roles // Array de strings, ej: ["MANAGER"]
        })
    };
    return await authenticatedFetch("/users", options);
}

export async function updateUser(id, userData) {
    // 1. Actualizamos datos básicos (username, email, password si existe)
    const basePayload = {
        username: userData.username,
        email: userData.email,
    };

    if (userData.password && userData.password.trim() !== "") {
        basePayload.password = userData.password;
    }

    // Nota: Si tu backend tiene un PUT /users/{id} para esto:
    await authenticatedFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(basePayload)
    });

    // 2. Si el backend maneja los roles por separado en /users/{id}/roles
    if (userData.roles && userData.roles.length > 0) {
        await authenticatedFetch(`/users/${id}/roles`, {
            method: "PUT",
            body: JSON.stringify(userData.roles) // Envía directamente la lista ['SYSADMIN', 'SELLER']
        });
    }

    return { id, ...userData };
}