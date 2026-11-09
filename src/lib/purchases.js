import { authenticatedFetch } from "@/lib/auth.js";

const API_URL = "http://localhost:8080";

export async function createPurchaseInvoice(purchaseData) {
    const options =  {
        method: "POST",
        body: JSON.stringify(purchaseData)
    };

    const path = "/purchases";

    const response = await authenticatedFetch(path, options);

    return response;
}

export async function getPurchases(filters = {}, options = {}) {
    const { search = "", page = 0 } = filters;

    const params = new URLSearchParams({
        page: String(page)
    });

    if (search.trim()) {
        params.set("search", search.trim());
    }

    const path = `/purchases?${params}`;

    const json = await authenticatedFetch(path, options);
    
    return json;
}

export async function getPurchaseById(id) {
    const path = `/purchases/${id}`;
    const json = await authenticatedFetch(path, {});
    return json;
}

export async function cancelPurchase(id) {
    const options = {
        method: "DELETE" // O "PUT" según el estándar de tu backend para anular
    };
    const path = `/purchases/${id}`;
    const json = await authenticatedFetch(path, options);
    return json;
}


