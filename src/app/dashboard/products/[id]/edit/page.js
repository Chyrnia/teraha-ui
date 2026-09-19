import { getProductById } from "@/lib/products.js";
import ProductForm from "@/components/products/ProductForm.jsx";

export default async function EditProductPage({ params }) {
	const { id } = await params;
	const product = await getProductById(id);

	if(!product){
		return (
			<section className="p-8">
				<h1 className="text-2xl font-semibold">
					Producto no encontrado
				</h1>
			</section>
		);
	}

	return (
		<section className="p-8">
			<div>
				<h1 className="text-2xl font-semibold">
					Editar Producto
				</h1>
				<p className="mt-1 text-sm text-[#A4BCC7]">
					Modifica los datos del producto.
				</p>
			</div>

			<ProductForm
				product={product}
				mode="edit"
			/>
		</section>
	);
}
