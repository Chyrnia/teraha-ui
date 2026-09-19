import { Eye } from 'lucide-react';
import Link from "next/link";

export default function ProductList({products}){
	return(
		<table className="mt-6 w-full bg-[#142126] border border-[#3D4A3E] border-separate border-spacing-0 rounded-xl overflow-hidden">
			<colgroup>
				<col className="w-16"/>
				<col/>
				<col/>
				<col/>
				<col/>
				<col className="w-24"/>
				<col className="w-24"/>
			</colgroup>
			<thead className="[&_th]:py-3 [&_th]:px-4">
				<tr className="bg-[#101D22] text-[#BBCBBB]">
					<th>#Id</th>
					<th>Código</th>
					<th>Descripción</th>
					<th>Precio</th>
					<th>Stock</th>
					<th>Margen</th>
					<th>Acción</th>
				</tr>
			</thead>
			<tbody className="text-[#BBCBBB] [&_td]:py-3 [&_td]:px-4">
		{products.map((p) =>
				(<tr key={p.id}>
					<td className="text-center">{p.id}</td>
					<td className="text-left">{p.code}</td>
					<td className="text-left">{p.description}</td>
					<td className="text-right">{p.price}</td>
					<td className="text-center">{p.stock}</td>
					<td className="text-center text-[#54E98A]">{p.margin}%</td>
					<td className="text-center"><Link
													href={`/dashboard/products/${p.id}`}
													className="inline-flex items-center hover:text-[#54E98A]"
													aria-label="Ver producto"
												> 
													<Eye/>
												</Link> </td>
				</tr>))}
			</tbody>

		</table>
	);
}
