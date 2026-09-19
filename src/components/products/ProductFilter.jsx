"use client";
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getProductCategories } from "@/lib/products.js";

export default function ProductFilter({ search, setSearch, categories, addCategory, removeCategory }){
	const [ productCategories, setProductCategories ] = useState([]);
	const [ selectedCat, setSelectedCat ] = useState("");

	useEffect(() => {
		async function fetchCategories() {
			const response = await getProductCategories();
			setProductCategories(response);
		}
		fetchCategories();
	}, []);

	return(
			<div className="mt-6 flex bg-[#142126] border border-[#3D4A3E] rounded-xl gap-6 p-4">
				{/* input field */}
				<div className="flex flex-col">
					<label htmlFor="product-search" className="text-[#BBCBBB] text-xs">
						BUSCAR
					</label>
					<div 
						className="w-96 flex items-center rounded-md bg-[#041015] border border-[#3D4A3E]"
					>
						<input
							id="product-search"
							type="search"
							placeholder="Buscar por nombre o código..."
							value={search}
							onChange={(e) =>  setSearch(e.target.value)}
							className="flex-1 bg-transparent border-none py-1 px-4 text-[#6B7280] placeholder:text-[#6B7280]"
						/> 
						<button 
							className="text-[#003919] bg-[#54E98A] rounded-md py-1 px-1"
						>
							<Search />
						</button>
					</div>
				</div>

				{/* filters/categories */}
				<div className="flex-1">
					<span className="block text-[#BBCBBB] text-xs">
						FILTROS
					</span>
					<div className="flex gap-4 items-center">
						<div>
							<select id="category-filter"
								value={selectedCat}
								onChange={(e) => {
									if(e.target.value !== ""){
										addCategory(e.target.value);
										setSelectedCat("");
									}
								}}
								className="w-32 py-1 px-4 border border-[#3D4A3E] text-center text-semibold text-[#54E98A] rounded-md"
							>
								<option value="">Categoría</option>
								{productCategories.map(c =>
									<option key={c} value={c}>{c}</option>)}
							</select>
						</div>
						<div className="flex-1 flex flex-wrap gap-2">
								{categories.map(cat =>
									<div 
										className="flex items-center gap-1 rounded-full bg-[#354C56] px-3 py-1"
										key={cat}
									> 
										<button 
											aria-label={`Quitar filtro ${cat}`}
											onClick={() => removeCategory(cat)}
											className="text-[#A4BCC7] text-xs"
										> 
											{cat} 
										</button>
									</div>
								)}
						</div>
					</div>
				</div>
			</div>
	);
}
