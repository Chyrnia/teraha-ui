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

export async function getProducts(filters) {
	const { search, categories } = filters;

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
