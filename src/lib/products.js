import { authenticatedFetch } from "@/lib/auth.js";

export async function getProducts(filters) {
	const { search = "", page = 0 } = filters;

	const params = new URLSearchParams({
		page: String(page)
	});

	if(search.trim()){
		params.set("search", search.trim());
	}

	const path = `/products?${params}`;

	const json = await authenticatedFetch(path, {});
	
	return json;
}

export async function getProductById(id){

	const path = `/products/${id}`;

	const json = await authenticatedFetch(path, {});

	return json;
	
}

export async function getProductCategories(){
	return [ "Pantalones", "Camisas" ];
}


export async function createProduct(product){

	const options = {
		method: "POST",
		body: JSON.stringify(product),
	};

	const newProduct = await authenticatedFetch("/products", options);

	return newProduct;
}

export async function updateProduct(id, data){
	const {
		code,
		description,
		price,
		margin,
		supplierIds,
		categoryIds
	} = data;
	
	const payload = {
		code,
		description,
		price,
		margin,
		supplierIds,
		categoryIds
	};

	const path = `/products/${id}`;
	const options = {
		method: "PUT",
		body: JSON.stringify(payload)
	}

	const updatedProduct = await authenticatedFetch(path, options);

	return updatedProduct;
}

export async function deleteProduct(id){
	const options = {
		method: "DELETE",
	};
	const path = `/products/${id}`;

	return authenticatedFetch(path, options);
}


/*

// src/lib/products.js
const API_URL = "http://localhost:8080";

export async function getProducts(search = "") {
    try {
        const url = search ? `${API_URL}/products?search=${encodeURIComponent(search)}` : `${API_URL}/products`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) throw new Error("Error al obtener los productos");
        
        const data = await response.json();
        // Si el backend devuelve un objeto Page de Spring Data, los elementos vienen en 'content'
        return data.content || data;
    } catch (error) {
        console.error("Error en getProducts:", error);
        return [];
    }
}

export async function createProduct(productData) {
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            code: productData.code,
            description: productData.description,
            stock: Number(productData.stock || 0),
            price: Number(productData.price),
            cost: Number(productData.cost),
            margin: Number(productData.margin || 0)
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el producto en el backend");
    }

    return await response.json();
}


*/
