"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductList from "@/components/products/ProductList.jsx";
import ProductFilter from "@/components/products/ProductFilter.jsx";
import { getProducts } from "@/lib/products.js";

export default function ProductsPage(){
	const [ search, setSearch ] = useState("");
	const [ categories, setCategories ] = useState([]);
	const [ products, setProducts ] = useState([]);

	const filters = {
		search,
		categories
	};

	useEffect(() => {
		async function fetchProducts(){
			const response = await getProducts(filters);
			setProducts(response);
		}
		fetchProducts();
	},[search, categories]);

	function addCategory(newCat){
		if(!categories.includes(newCat))
			setCategories(current => [...current, newCat]);
	}

	function removeCategory(oldCat){
		setCategories(current => current.filter(cat => cat !== oldCat));
	}

	return (
		<section className="p-8">
		{/* Page Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Lista de Productos</h1>
				<Link
					href='/dashboard/products/new'
					className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#54E98A] text-[#003919]"
				>
					<Plus />
					Agregar Producto
				</Link>
			</div>

		{/* filters */}
			<ProductFilter 
				search={search}
				setSearch={setSearch}
				categories={categories}
				addCategory={addCategory}
				removeCategory={removeCategory}
			/>

		{/* Product list */}
			<ProductList products={products}/>
		</section>
	);
}
