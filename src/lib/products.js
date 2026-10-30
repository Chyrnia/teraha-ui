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
