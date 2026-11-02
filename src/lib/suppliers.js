import { authenticatedFetch } from "@/lib/auth.js";

export async function getSuppliers() {
    const suppliers = [];
    let page = 0;
    let lastPage = false;

    while (!lastPage) {
        const response = await authenticatedFetch(`/suppliers?page=${page}`);

        suppliers.push(...response.content);
        lastPage = response.last;
        page++;
    }

    return suppliers;
}
