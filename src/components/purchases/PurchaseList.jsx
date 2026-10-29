import { Eye } from 'lucide-react';
import Link from "next/link";

export default function PurchaseList({ purchases }) {
    return (
        <table className="mt-6 w-full bg-[#142126] border border-[#3D4A3E] border-separate border-spacing-0 rounded-xl overflow-hidden">
            <colgroup>
                <col className="w-16"/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col className="w-24"/>
            </colgroup>
            <thead className="[&_th]:py-3 [&_th]:px-4">
            <tr className="bg-[#101D22] text-[#BBCBBB]">
                <th>#Id</th>
                <th>Nro. Factura</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acción</th>
            </tr>
            </thead>
            <tbody className="text-[#BBCBBB] [&_td]:py-3 [&_td]:px-4">
            {purchases.map((p) => (
                <tr key={p.id}>
                    <td className="text-center">{p.id}</td>
                    <td className="text-left font-semibold text-[#D7E5EC]">{p.invoiceNumber}</td>
                    <td className="text-left">{p.supplier}</td>
                    <td className="text-center">{p.date}</td>
                    <td className="text-right text-[#54E98A]">₲ {p.total.toLocaleString()}</td>
                    <td className="text-center">
                        <Link
                            href={`/dashboard/purchases/${p.id}`}
                            className="inline-flex items-center hover:text-[#54E98A]"
                            aria-label="Ver compra"
                        >
                            <Eye />
                        </Link>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}