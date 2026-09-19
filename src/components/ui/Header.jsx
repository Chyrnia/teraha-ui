import { Plus, Bell, CircleQuestionMark, CircleUserRound } from 'lucide-react';

export default function Header({ user }){
	return(
		<div className="flex flex-row items-center h-16 px-6 border-b bg-[#142126] border-[#3D4A3E]">
			<div className="brand text-2xl font-semibold text-[#54E98A]">
				<h2>Teraha</h2>
			</div>

			<div className="actions flex flex-row ml-auto gap-4 items-center">
				<button aria-label="Notificaciones" className="text-[#BBCBBB] p-2 rounded-md hover:bg-[#54E98A0D] hover:text-[#54E98A]">
					<Bell size={26} />
				</button>

				<button aria-label="Ayuda" className="text-[#BBCBBB] p-2 rounded-md hover:bg-[#54E98A0D] hover:text-[#54E98A]">
					<CircleQuestionMark size={26} />
				</button>
				 
				<button aria-label="Nueva Venta" className="flex items-center gap-2 px-4 py-2 bg-[#54E98A] rounded-md text-[#003919]">
					<Plus />
					<span>Nueva Venta</span>
				</button>

				<button aria-label="Perfil" className="text-[#BBCBBB] p-2 rounded-md hover:bg-[#54E98A0D] hover:text-[#54E98A]">
					<CircleUserRound size={26}/>
				</button>
			</div>
		</div>
	);
}
