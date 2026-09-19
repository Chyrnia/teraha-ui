"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { createProduct, updateProduct } from "@/lib/products.js";

const INITIAL_PRODUCT = {
	code: "",
	description: "",
	price: "",
	cost: "",
	stock: "",
	margin: "",
	category: ""
};

export default function ProductForm({ product: initialProduct, mode = "create" }) {
	const router = useRouter();
	const [product, setProduct] = useState(initialProduct ?? INITIAL_PRODUCT);

	function handleChange(e) {
		const { name, value } = e.target;

		setProduct(current => ({
			...current,
			[name]: value
		}));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if(mode === "edit"){
			await updateProduct(product.id, product);
		} else {
			await createProduct(product);
		}

		router.push("/dashboard/products/");
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="mt-6 bg-[#142126] border border-[#3D4A3E] rounded-xl p-6"
		>
			<div className="grid grid-cols-2 gap-6">

				<div className="flex flex-col gap-2">
					<label
						htmlFor="code"
						className="text-xs text-[#BBCBBB]"
					>
						CÓDIGO
					</label>

					<input
						id="code"
						name="code"
						type="text"
						value={product.code}
						onChange={handleChange}
						className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="category"
						className="text-xs text-[#BBCBBB]"
					>
						CATEGORÍA
					</label>

					<input
						id="category"
						name="category"
						type="text"
						value={product.category}
						onChange={handleChange}
						className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
					/>
				</div>

				<div className="col-span-2 flex flex-col gap-2">
					<label
						htmlFor="description"
						className="text-xs text-[#BBCBBB]"
					>
						DESCRIPCIÓN
					</label>

					<input
						id="description"
						name="description"
						type="text"
						value={product.description}
						onChange={handleChange}
						className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="price"
						className="text-xs text-[#BBCBBB]"
					>
						PRECIO
					</label>

					<input
						id="price"
						name="price"
						type="number"
						value={product.price}
						onChange={handleChange}
						className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="cost"
						className="text-xs text-[#BBCBBB]"
					>
						COSTO
					</label>

					<input
						id="cost"
						name="cost"
						type="number"
						value={product.cost}
						onChange={handleChange}
						className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="stock"
						className="text-xs text-[#BBCBBB]"
					>
						STOCK
					</label>

					<input
						id="stock"
						name="stock"
						type="number"
						value={product.stock}
						onChange={handleChange}
						className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="margin"
						className="text-xs text-[#BBCBBB]"
					>
						MARGEN (%)
					</label>

					<input
						id="margin"
						name="margin"
						type="number"
						value={product.margin}
						onChange={handleChange}
						className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
					/>
				</div>
			</div>

			<div className="mt-8 flex justify-end gap-3">
				<button
					type="button"
					onClick={ () => router.push("/dashboard/products")}
					className="px-4 py-2 rounded-md border border-[#3D4A3E] text-[#BBCBBB]"
				>
					Cancelar
				</button>

				<button
					type="submit"
					className="px-4 py-2 rounded-md bg-[#54E98A] text-[#003919]"
				>
					{mode === "edit" ? "Guardar Cambios" : "Crear Producto" }
				</button>
			</div>
		</form>
	);
}
