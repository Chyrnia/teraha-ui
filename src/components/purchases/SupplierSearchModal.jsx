"use client";
import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";

// Mock inicial de proveedores (puedes mover esto a lib/suppliers.js más adelante)
let mockSuppliers = [
    { id: 1, name: "Distribuidora Mayorista S.A.", ruc: "80012345-6" },
    { id: 2, name: "Importadora del Este", ruc: "80098765-1" }
];

export default function SupplierSearchModal({ isOpen, onClose, onSelectSupplier }) {
    const [search, setSearch] = useState("");
    const [suppliers, setSuppliers] = useState(mockSuppliers);
    const [isCreating, setIsCreating] = useState(false);

    // Formulario para creación express de proveedor
    const [newSupplier, setNewSupplier] = useState({ name: "", ruc: "" });

    useEffect(() => {
        if (isOpen) {
            setIsCreating(false);
            setNewSupplier({ name: "", ruc: "" });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.ruc.includes(search)
    );

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (!newSupplier.name.trim()) return;

        const created = {
            id: Date.now(),
            name: newSupplier.name,
            ruc: newSupplier.ruc || "Sin RUC"
        };

        // Lo agregamos a la lista local y lo seleccionamos de inmediato
        setSuppliers([created, ...suppliers]);
        onSelectSupplier(created);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 shadow-2xl">
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#D7E5EC]">
                        {isCreating ? "Registrar Nuevo Proveedor Express" : "Buscar Proveedor"}
                    </h3>
                    <button onClick={onClose} className="text-[#BBCBBB] hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {!isCreating ? (
                    <>
                        {/* Barra de Búsqueda y Botón Nuevo */}
                        <div className="flex gap-3 mb-4">
                            <div className="flex-1 flex items-center rounded-md bg-[#041015] border border-[#3D4A3E] px-3">
                                <Search className="text-[#BBCBBB] mr-2" size={18} />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Buscar por nombre o RUC..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent py-2 text-[#D7E5EC] outline-none placeholder:text-[#6B7280]"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreating(true)}
                                className="flex items-center gap-1 px-4 py-2 bg-[#54E98A] text-[#003919] font-semibold rounded-md hover:bg-[#43cd77]"
                            >
                                <Plus size={18} />
                                <span>Nuevo</span>
                            </button>
                        </div>

                        {/* Resultados */}
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {filteredSuppliers.length > 0 ? (
                                filteredSuppliers.map((s) => (
                                    <div
                                        key={s.id}
                                        onClick={() => {
                                            onSelectSupplier(s);
                                            onClose();
                                        }}
                                        className="flex justify-between items-center p-3 rounded-lg bg-[#041015] border border-[#3D4A3E] hover:border-[#54E98A] cursor-pointer transition-colors"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-[#D7E5EC]">{s.name}</p>
                                            <span className="text-xs text-[#BBCBBB]">RUC: {s.ruc}</span>
                                        </div>
                                        <span className="text-xs text-[#54E98A] font-semibold">Seleccionar</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-[#BBCBBB] mb-3">No se encontró ningún proveedor.</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewSupplier({ name: search, ruc: "" });
                                            setIsCreating(true);
                                        }}
                                        className="text-xs px-3 py-1.5 bg-[#354C56] text-[#54E98A] rounded-md border border-[#3D4A3E] hover:bg-[#3d5763]"
                                    >
                                        + Registrar &quot;{search}&quot; al vuelo
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Formulario de Creación Express */
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-[#BBCBBB] mb-1">RAZÓN SOCIAL / NOMBRE</label>
                            <input
                                type="text"
                                required
                                autoFocus
                                placeholder="Ej: Repuestos del Sur S.A."
                                value={newSupplier.name}
                                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-3 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[#BBCBBB] mb-1">CI / RUC</label>
                            <input
                                type="text"
                                placeholder="Ej: 80044556-7"
                                value={newSupplier.ruc}
                                onChange={(e) => setNewSupplier({ ...newSupplier, ruc: e.target.value })}
                                className="w-full bg-[#041015] border border-[#3D4A3E] rounded-md px-3 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 border border-[#3D4A3E] rounded-md text-[#BBCBBB]"
                            >
                                Volver
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#54E98A] text-[#003919] font-semibold rounded-md hover:bg-[#43cd77]"
                            >
                                Guardar y Seleccionar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}