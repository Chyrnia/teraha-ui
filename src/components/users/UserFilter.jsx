// src/components/users/UserFilter.jsx
"use client";
import { Search } from "lucide-react";

export default function UserFilter({ search, setSearch }) {
    return (
        <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl p-4 mb-6">
            <div className="flex items-center bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2">
                <Search className="text-[#54E98A] mr-3" size={20} />
                <input
                    type="text"
                    placeholder="Buscar usuario por nombre de usuario o correo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-[#D7E5EC] outline-none text-sm placeholder:text-[#6B7280]"
                />
            </div>
        </div>
    );
}