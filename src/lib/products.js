let products = [
	{	id: 1,
		code: "4PP13",
		description: "Remera",
		price: 20,
		stock: 60,
		margin: 20,
		category: "Tops"
	},
	{
		id: 2,
		code: "P13RN4",
		description: "Pantalon",
		price: 1200,
		stock: 10,
		margin: 22,
		category: "Pantalones"
	},
	{
		id: 3,
		code: "P4745",
		description: "Zapatillas",
		price: 1000000,
		stock: 1,
		margin: 14,
		category: "Calzados"
	}
];

let categories = [
	"Calzados",
	"Tops",
	"Pantalones",
	"Onesies"
];

export async function getProducts(filters = {}) {
	const { search = "", categories = [] } = filters;

	let result = products;

	if(search){
		const query = search.toLowerCase();

		result = result.filter(product =>
			product.description.toLowerCase().includes(query) ||
			product.code.toLowerCase().includes(query)
		);
	}

	if(categories.length > 0){
		result = result.filter(product =>
			categories.includes(product.category)
		);
	}

	return result;
}

export async function getProductCategories(){
	return categories;
}

export async function getProductById(id){
	return products.find(product => product.id == id);
}

export async function createProduct(product){
	const newProduct = {
		id: products.length + 1,
		...product
	};

	products.push(newProduct);

	return newProduct;
}

export async function updateProduct(id, data){
	const idx = products.findIndex(product => product.id == id);

	products[idx] = {
		...products[idx],
		...data
	}

	return products[idx];
}

export async function deleteProduct(id){
	products = products.filter(product => product.id !== id);
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
