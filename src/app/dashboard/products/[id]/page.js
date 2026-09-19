import ProductDetails from "@/components/products/ProductDetails.jsx";
import { getProductById } from "@/lib/products.js";

export default async function ProductPage({ params }) {
	const { id } = await params;
	const product = await getProductById(id);

	return (
		<section className="p-8">
			<div>
				<h1 className="text-2xl font-semibold">
					Producto
				</h1>
				<p className="mt-1 text-sm text-[#A4BCC7]">
					Información del producto.
				</p>
			</div>

			<ProductDetails product={product} />
		</section>
	);
}
