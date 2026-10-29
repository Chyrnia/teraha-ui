// src/components/purchases/ProductSearchModal.jsx
"use client";
import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import { getProducts } from "@/lib/products";

export default function ProductSearchModal({ isOpen, onClose, onSelectProduct, onCreateNewProduct }) {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (isOpen) {
            async function load() {
                const data = await getProducts();
                setProducts(data);
            }
            load();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredProducts = products.filter(p =>
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#142126] border border-[#3D4A3E] rounded-xl p-6 shadow-2xl">
                {/* Cabecera Modal */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#D7E5EC]">Buscar Producto</h3>
                    <button onClick={onClose} className="text-[#BBCBBB] hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Búsqueda y Botón de Crear Express */}
                <div className="flex gap-3 mb-4">
                    <div className="flex-1 flex items-center rounded-md bg-[#041015] border border-[#3D4A3E] px-3">
                        <Search className="text-[#BBCBBB] mr-2" size={18} />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Buscar por código o descripción..."
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
                        <span>Nuevo Producto</span>
                    </button>
                </div>

                {/* Lista de Resultados */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => {
                                    onSelectProduct(p);
                                    onClose();
                                }}
                                className="flex justify-between items-center p-3 rounded-lg bg-[#041015] border border-[#3D4A3E] hover:border-[#54E98A] cursor-pointer transition-colors"
                            >
                                <div>
                                    <span className="text-xs text-[#54E98A] font-mono">{p.code}</span>
                                    <p className="text-sm font-medium text-[#D7E5EC]">{p.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-[#BBCBBB]">Costo</span>
                                    <p className="text-sm font-semibold text-[#D7E5EC]">₲ {Number(p.cost || p.price || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-[#BBCBBB] mb-3">No se encontró ningún producto con ese criterio.</p>
                            <button
                                type="button"
                                onClick={onCreateNewProduct}
                                className="text-xs px-3 py-1.5 bg-[#354C56] text-[#54E98A] rounded-md border border-[#3D4A3E] hover:bg-[#3d5763]"
                            >
                                + Registrar este producto al vuelo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}