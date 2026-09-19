"use client";

import {usePathname} from 'next/navigation';
import Link from 'next/link';

export default function SidebarItem({href, icon, children}){
	const pathname = usePathname();
	const isActive = pathname === href;

	return(
		<li>
			<Link 
				href={href}
				className={ `w-full items-center font-semibold flex gap-3 py-2 px-4 relative ${isActive ? 
						"rounded-xl text-[#A4BCC7] bg-[#354C56] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#54E98A] before:rounded-r-md " : 
						"text-[#BBCBBB]"}` }
			>
				{icon}
				{children}
			</Link>
		</li>
	);
}
