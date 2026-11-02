// src/components/purchases/ProductSearchModal.jsx
"use client";
import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import { getProducts } from "@/lib/products";

export default function ProductSearchModal({ isOpen, onClose, onSelectProduct, onCreateNewProduct }) {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Consulta dinámica al backend cada vez que cambie 'search' o se abra el modal
    useEffect(() => {
        if (isOpen) {
            setError("");
            
            async function fetchProducts() {
                setLoading(true);
                try {
                    const data = await getProducts(search);
                    setProducts(data);
                } catch (err) {
                    console.error("Error al buscar productos:", err);
                    setError("No se pudieron cargar los productos desde el servidor.");
                } finally {
                    setLoading(false);
                }
            }

            // Un pequeño debounce para optimizar las peticiones mientras se escribe
            const timer = setTimeout(() => {
                fetchProducts();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen, search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#D7E5EC]">Buscar Producto</h3>
                    <button onClick={onClose} className="text-[#BBCBBB] hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-400 text-xs">
                        {error}
                    </div>
                )}

                {/* Barra de Búsqueda y Botón Nuevo Express */}
                <div className="flex gap-3 mb-4">
                    <div className="flex-1 flex items-center rounded-md bg-[#041015] border border-[#3D4A3E] px-3">
                        <Search className="text-[#BBCBBB] mr-2" size={18} />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Buscar por código, SKU o descripción..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent py-2 text-[#D7E5EC] outline-none placeholder:text-[#6B7280]"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onCreateNewProduct}
                        className="flex items-center gap-1 px-4 py-2 bg-[#54E98A] text-[#003919] font-semibold rounded-md hover:bg-[#43cd77]"
                    >
                        <Plus size={18} />
                        <span>Nuevo Express</span>
                    </button>
                </div>

                {/* Resultados de la Búsqueda */}
                <div className="max-h-72 overflow-y-auto space-y-2">
                    {loading ? (
                        <p className="text-center py-6 text-[#BBCBBB] text-xs">Buscando productos en el servidor...</p>
                    ) : products.length > 0 ? (
                        products.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => {
                                    onSelectProduct(p);
                                    onClose();
                                }}
                                className="flex justify-between items-center p-3 rounded-lg bg-[#041015] border border-[#3D4A3E] hover:border-[#54E98A] cursor-pointer transition-colors"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono bg-[#354C56] text-[#54E98A] px-2 py-0.5 rounded">
                                            {p.code}
                                        </span>
                                        <p className="text-sm font-medium text-[#D7E5EC]">{p.description}</p>
                                    </div>
                                    <span className="text-xs text-[#BBCBBB] mt-1 block">
                                        Stock actual: {p.stock} | Costo: ₲ {(p.cost || 0).toLocaleString()} | Precio Venta: ₲ {(p.price || 0).toLocaleString()}
                                    </span>
                                </div>
                                <span className="text-xs text-[#54E98A] font-semibold">Seleccionar</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-[#BBCBBB] mb-3 text-sm">No se encontró ningún producto con &quot;{search}&quot;.</p>
                            <button
                                type="button"
                                onClick={onCreateNewProduct}
                                className="text-xs px-4 py-2 bg-[#354C56] text-[#54E98A] rounded-md border border-[#3D4A3E] hover:bg-[#3d5763] font-semibold"
                            >
                                + Dar de alta &quot;{search}&quot; de forma express
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}