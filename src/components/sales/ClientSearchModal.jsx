// src/components/sales/ClientSearchModal.jsx
"use client";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { getClients } from "@/lib/clients";

export default function ClientSearchModal({ isOpen, onClose, onSelectClient }) {
    const [search, setSearch] = useState("");
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadClients();
        }
    }, [isOpen, search]);

    async function loadClients() {
        try {
            setLoading(true);
            const data = await getClients({ search });
            const list = Array.isArray(data) ? data : (data.content || []);
            setClients(list);
        } catch (err) {
            console.error("Error al buscar clientes:", err);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#142126] border border-[#3D4A3E] rounded-xl w-full max-w-2xl p-6 shadow-2xl text-[#D7E5EC]">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#3D4A3E]">
                    <h2 className="text-lg font-bold">Seleccionar Cliente</h2>
                    <button onClick={onClose} className="text-[#BBCBBB] hover:text-[#54E98A]">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex items-center bg-[#041015] border border-[#3D4A3E] rounded-md px-3 py-2 mb-4">
                    <Search className="text-[#54E98A] mr-2" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o documento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent text-sm text-[#D7E5EC] outline-none placeholder:text-[#6B7280]"
                        autoFocus
                    />
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#3D4A3E]">
                    {loading ? (
                        <div className="py-4 text-center text-xs text-[#BBCBBB]">Buscando clientes...</div>
                    ) : clients.length === 0 ? (
                        <div className="py-4 text-center text-xs text-[#BBCBBB]">No se encontraron clientes.</div>
                    ) : (
                        clients.map((client) => (
                            <div
                                key={client.id}
                                onClick={() => {
                                    onSelectClient(client);
                                    onClose();
                                }}
                                className="py-3 px-2 flex justify-between items-center hover:bg-[#18282e] cursor-pointer transition-colors"
                            >
                                <div>
                                    <p className="font-semibold text-sm text-[#D7E5EC]">{client.name}</p>
                                    <p className="text-xs text-[#BBCBBB]">Doc: {client.document || "S/N"}</p>
                                </div>
                                <span className="text-xs text-[#54E98A] font-medium bg-[#54E98A]/10 px-2 py-1 rounded">
                                    Seleccionar
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}