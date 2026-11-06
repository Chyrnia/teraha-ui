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