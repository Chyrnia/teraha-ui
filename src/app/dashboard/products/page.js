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
	const [ page, setPage ] = useState(0);
	const [ totalPages, setTotalPages ] = useState(0);
	const [ isLoading, setIsLoading ] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const filters = {
		search,
		categories,
		page
	};

	useEffect(() => {
		async function fetchProducts(){
			setIsLoading(true);
			try{
			const response = await getProducts(filters);
			setProducts(response.content);
			setTotalPages(response.totalPages);
			} catch (error) {
				console.error("Failed to fetch products: " + error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchProducts();
	},[search, page, refreshKey]);

	function addCategory(newCat){
		if(!categories.includes(newCat))
			setCategories(current => [...current, newCat]);
	}

	function removeCategory(oldCat){
		setCategories(current => current.filter(cat => cat !== oldCat));
	}

	function handleProductDeactivated() {
		if (products.length === 1 && page > 0) {
			setPage(current => current - 1);
		} else {
			setRefreshKey(current => current + 1);
		}
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
			<ProductList 
				products={products} 
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				loading={isLoading}
				onProductDeactivated={handleProductDeactivated}
			/>
		</section>
	);
}
