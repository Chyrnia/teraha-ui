import Link from "next/link";

export default function ProductDetails({ product }) {
	if (!product) {
		return (
			<div className="mt-6 bg-[#142126] border border-[#3D4A3E] rounded-xl p-6">
				<p className="text-[#BBCBBB]">
					Producto no encontrado.
				</p>

				<Link
					href="/dashboard/products"
					className="inline-block mt-4 px-4 py-2 rounded-md bg-[#54E98A] text-[#003919]"
				>
					Volver a Productos
				</Link>
			</div>
		);
	}

	return (
		<div className="mt-6 bg-[#142126] border border-[#3D4A3E] rounded-xl p-6">

			<div className="grid grid-cols-2 gap-6">

				<div>
					<span className="block text-xs text-[#BBCBBB]">
						CÓDIGO
					</span>
					<p className="mt-1 text-[#D7E5EC]">
						{product.code}
					</p>
				</div>

				<div>
					<span className="block text-xs text-[#BBCBBB]">
						CATEGORÍA
					</span>
					<p className="mt-1 text-[#D7E5EC]">
						{product.category}
					</p>
				</div>

				<div className="col-span-2">
					<span className="block text-xs text-[#BBCBBB]">
						DESCRIPCIÓN
					</span>
					<p className="mt-1 text-[#D7E5EC]">
						{product.description}
					</p>
				</div>

				<div>
					<span className="block text-xs text-[#BBCBBB]">
						PRECIO
					</span>
					<p className="mt-1 text-[#D7E5EC]">
						{product.price}
					</p>
				</div>

				<div>
					<span className="block text-xs text-[#BBCBBB]">
						COSTO
					</span>
					<p className="mt-1 text-[#D7E5EC]">
						{product.cost ?? "—"}
					</p>
				</div>

				<div>
					<span className="block text-xs text-[#BBCBBB]">
						STOCK
					</span>
					<p className="mt-1 text-[#D7E5EC]">
						{product.stock}
					</p>
				</div>

				<div>
					<span className="block text-xs text-[#BBCBBB]">
						MARGEN
					</span>
					<p className="mt-1 text-[#54E98A]">
						{product.margin}%
					</p>
				</div>

			</div>

			<div className="mt-8 flex justify-end gap-3">
				<Link
					href="/dashboard/products"
					className="px-4 py-2 rounded-md border border-[#3D4A3E] text-[#BBCBBB]"
				>
					Volver
				</Link>

				<Link
					href={`/dashboard/products/${product.id}/edit`}
					className="px-4 py-2 rounded-md bg-[#54E98A] text-[#003919]"
				>
					Editar Producto
				</Link>
			</div>
		</div>
	);
}
