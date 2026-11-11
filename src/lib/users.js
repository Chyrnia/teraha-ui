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
            roles: userData.roles 
        })
    };
    return await authenticatedFetch("/users", options);
}

export async function updateUser(id, userData) {
    const payload = {
        username: userData.username,
        email: userData.email,
        roles: userData.roles
    };

    // Solo enviamos la contraseña si el usuario escribió una nueva
    if (userData.password && userData.password.trim() !== "") {
        payload.password = userData.password;
    }

    const options = {
        method: "PUT",
        body: JSON.stringify(payload)
    };

    return await authenticatedFetch(`/users/${id}`, options);
}