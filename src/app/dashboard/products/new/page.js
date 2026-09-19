import ProductForm from "@/components/products/ProductForm.jsx";

export default function CreateProductPage() {
	return (
		<section className="p-8">
			<div>
				<h1 className="text-2xl font-semibold">
					Agregar Producto
				</h1>
				<p className="mt-1 text-sm text-[#A4BCC7]">
					Completa los datos del nuevo producto.
				</p>
			</div>

			<ProductForm />
		</section>
	);
}
