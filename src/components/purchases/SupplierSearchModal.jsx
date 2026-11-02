// src/components/purchases/SupplierSearchModal.jsx
"use client";
import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import { getSuppliers, createSupplier } from "@/lib/suppliers";

export default function SupplierSearchModal({ isOpen, onClose, onSelectSupplier }) {
    const [search, setSearch] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [newSupplier, setNewSupplier] = useState({
        name: "",
        document: "",
        timbrado: "",
        address: "",
        email: "",
        phone: ""
    });

    // Carga dinámica desde el backend cuando cambia 'search' o se abre el modal
    useEffect(() => {
        if (isOpen) {
            setIsCreating(false);
            setError("");
            
            async function loadSuppliers() {
                setLoading(true);
                try {
                    const data = await getSuppliers(search);
                    setSuppliers(data);
                } catch (err) {
                    console.error("Error al cargar proveedores:", err);
                } finally {
                    setLoading(false);
                }
            }

            // Un pequeño debounce para no saturar la API en cada tecla
            const timer = setTimeout(() => {
                loadSuppliers();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen, search]);

    if (!isOpen) return null;

    // El filtrado ya se maneja desde el backend gracias a getSuppliers(search), 
    // pero mantenemos esto por si recibimos la lista completa.
    const filteredSuppliers = suppliers;

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!newSupplier.name.trim() || !newSupplier.timbrado.trim()) {
            setError("El nombre y el timbrado son obligatorios.");
            return;
        }

        setLoading(true);

        try {
            // Guardamos directamente en la base de datos del backend
            const created = await createSupplier(newSupplier);

            onSelectSupplier(created);
            onClose();
        } catch (err) {
            setError(err.message || "Error al registrar el proveedor en el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#D7E5EC]">
                        {isCreating ? "Registrar Nuevo Proveedor" : "Buscar Proveedor"}
                    </h3>
                    <button onClick={onClose} className="text-[#BBCBBB] hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-400 text-xs">
                        {error}
                    </div>
                )}

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
                            {loading ? (
                                <p className="text-center py-4 text-[#BBCBBB] text-xs">Buscando en el servidor...</p>
                            ) : filteredSuppliers.length > 0 ? (
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
                                            <span className="text-xs text-[#BBCBBB]">RUC/Doc: {s.document} | Timbrado: {s.timbrado}</span>
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
                                            setNewSupplier(prev => ({ ...prev, name: search }));
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="text-xs text-[#BBCBBB]">NOMBRE / RAZÓN SOCIAL (name)</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder="Ej: Distribuidora del Sur S.A."
                                    value={newSupplier.name}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                    className="bg-[#041015] border border-[#3D4A3E] rounded-md px-3 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[#BBCBBB]">DOCUMENTO / RUC (document)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: 80044556-7"
                                    value={newSupplier.document}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, document: e.target.value })}
                                    className="bg-[#041015] border border-[#3D4A3E] rounded-md px-3 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[#BBCBBB]">TIMBRADO (timbrado - Obligatorio)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: 12345678"
                                    value={newSupplier.timbrado}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, timbrado: e.target.value })}
                                    className="bg-[#041015] border border-[#3D4A3E] rounded-md px-3 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[#BBCBBB]">TELÉFONO (phone)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: 0981123456"
                                    value={newSupplier.phone}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                    className="bg-[#041015] border border-[#3D4A3E] rounded-md px-3 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[#BBCBBB]">CORREO (email)</label>
                                <input
                                    type="email"
                                    placeholder="Ej: info@proveedor.com"
                                    value={newSupplier.email}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                    className="bg-[#041015] border border-[#3D4A3E] rounded-md px-3 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                />
                            </div>

                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="text-xs text-[#BBCBBB]">DIRECCIÓN (address)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Avda. España c/ Brasil"
                                    value={newSupplier.address}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                                    className="bg-[#041015] border border-[#3D4A3E] rounded-md px-4 py-2 text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                />
                            </div>
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
                                disabled={loading}
                                className="px-4 py-2 bg-[#54E98A] text-[#003919] font-semibold rounded-md hover:bg-[#43cd77] disabled:opacity-50"
                            >
                                {loading ? "Guardando..." : "Guardar y Seleccionar"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}