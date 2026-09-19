import { Banknote, ShoppingCart, Summary, Package, BookUser, Settings, LogOut } from 'lucide-react';
import SidebarItem from "@/components/ui/SidebarItem.jsx";

const ROUTES = {
	products: "/dashboard/products",
	sales: "/dashboard/sales",
	purchases: "/dashboard/purchases",
	reports: "/dashboard/reports",
	clients: "/dashboard/clients",
	settings: "/dashboard/settings",
	dashboard: "/dashboard",
};

export default function Sidebar(){

	return(
		<aside className="w-64 h-full bg-[#08151A] flex flex-col border-r border-r-[#101D22]">

			<nav className="flex-1 py-6">
				<ul className="list-none p-0 m-0 px-4">
					<SidebarItem href={ROUTES.sales} icon={ <Banknote size={28}/> }>
						Ventas
					</SidebarItem>
					<SidebarItem href={ROUTES.purchases} icon={ <ShoppingCart size={28}/> }>
						Compras
					</SidebarItem>
					<SidebarItem href={ROUTES.reports} icon={ <Summary size={28}/> }>
						Reportes
					</SidebarItem>
					<SidebarItem href={ROUTES.products} icon={ <Package size={28}/> }>
						Productos
					</SidebarItem>
					<SidebarItem href={ROUTES.clients} icon={ <BookUser size={28}/> }>
						Clientes
					</SidebarItem>
				</ul>
			</nav>

			<nav className="border-t border-t-[#101D22] py-6 ">
				<ul className="list-none p-0 m-0 px-4">
					<SidebarItem href={ROUTES.settings} icon={ <Settings size={28}/> }>
						Configuraciones
					</SidebarItem>
					<SidebarItem href={ROUTES.dashboard} icon={ <LogOut size={28}/> }>
						Salir
					</SidebarItem>
				</ul>
			</nav>
		</aside>
	);
}
