// src/app/dashboard/settings/page.jsx
"use client";
import { useState } from "react";
import { Mail, Palette, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("email");
    const [saved, setSaved] = useState(false);

    // Estados para Configuración de Emails
    const [emailConfig, setEmailConfig] = useState({
        senderEmail: "notificaciones@teraha.com",
        recipients: "admin@teraha.com, gerencia@teraha.com",
        frequency: "DAILY", // DAILY, WEEKLY, INSTANT
        customMessage: "Hola, adjuntamos el reporte automático de operaciones de la tienda de ropa.",
        includeLowStockAlerts: true,
        includeDailySales: true
    });

    // Estados para Configuración de Diseño / Apariencia
    const [themeConfig, setThemeConfig] = useState({
        primaryColor: "#54E98A", // El verde esmeralda actual
        tableDensity: "normal", // compact, normal, relaxed
        sidebarState: "expanded" // expanded, collapsed
    });

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <section className="w-full p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#D7E5EC]">Configuraciones del Sistema</h1>
                    <p className="mt-1 text-xs text-[#7F9699]">Personaliza las alertas por correo y la apariencia visual de la plataforma.</p>
                </div>
            </div>

            {saved && (
                <div className="mb-6 flex items-center gap-2 p-4 bg-[#54E98A]/10 border border-[#54E98A] rounded-xl text-[#54E98A] text-sm font-medium">
                    <CheckCircle2 size={18} />
                    ¡Configuración guardada exitosamente!
                </div>
            )}

            {/* Navegación por Pestañas */}
            <div className="flex gap-2 border-b border-[#3D4A3E] mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab("email")}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                        activeTab === "email" 
                            ? "border-[#54E98A] text-[#54E98A]" 
                            : "border-transparent text-[#BBCBBB] hover:text-white"
                    }`}
                >
                    <Mail size={18} />
                    <span>Envío de Correos</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("theme")}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                        activeTab === "theme" 
                            ? "border-[#54E98A] text-[#54E98A]" 
                            : "border-transparent text-[#BBCBBB] hover:text-white"
                    }`}
                >
                    <Palette size={18} />
                    <span>Apariencia y Estilo</span>
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* PESTAÑA 1: CONFIGURACIÓN DE EMAILS */}
                {activeTab === "email" && (
                    <div className="bg-[#142126] border border-[#3D4A3E] rounded-2xl p-6 sm:p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3D4A3E]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                                <Mail size={21} />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">Automatización de Reportes por Correo</h2>
                                <p className="text-xs text-[#7F9699]">Define quiénes reciben los resúmenes, frecuencia y contenido del mensaje.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]">
                                        CORREO REMITENTE (DESDE)
                                    </label>
                                    <input
                                        type="email"
                                        value={emailConfig.senderEmail}
                                        onChange={(e) => setEmailConfig({...emailConfig, senderEmail: e.target.value})}
                                        className="w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]">
                                        FRECUENCIA DE ENVÍO
                                    </label>
                                    <select
                                        value={emailConfig.frequency}
                                        onChange={(e) => setEmailConfig({...emailConfig, frequency: e.target.value})}
                                        className="w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                    >
                                        <option value="INSTANT">Al registrar cada venta / compra</option>
                                        <option value="DAILY">Resumen Diario (Al cierre)</option>
                                        <option value="WEEKLY">Resumen Semanal (Lunes)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]">
                                    DESTINATARIOS (SEPARADOS POR COMA)
                                </label>
                                <input
                                    type="text"
                                    value={emailConfig.recipients}
                                    onChange={(e) => setEmailConfig({...emailConfig, recipients: e.target.value})}
                                    placeholder="ej: gerencia@tienda.com, admin@tienda.com"
                                    className="w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]">
                                    MENSAJE PREDETERMINADO EN EL CUERPO DEL CORREO
                                </label>
                                <textarea
                                    rows={3}
                                    value={emailConfig.customMessage}
                                    onChange={(e) => setEmailConfig({...emailConfig, customMessage: e.target.value})}
                                    className="w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                />
                            </div>

                            <div className="pt-2 border-t border-[#3D4A3E] space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={emailConfig.includeLowStockAlerts}
                                        onChange={(e) => setEmailConfig({...emailConfig, includeLowStockAlerts: e.target.checked})}
                                        className="w-4 h-4 rounded border-[#354C56] bg-[#08151A] text-[#54E98A] focus:ring-0 cursor-pointer"
                                    />
                                    <span className="text-sm text-[#D7E5EC]">Incluir alerta automática cuando un producto tenga stock bajo</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={emailConfig.includeDailySales}
                                        onChange={(e) => setEmailConfig({...emailConfig, includeDailySales: e.target.checked})}
                                        className="w-4 h-4 rounded border-[#354C56] bg-[#08151A] text-[#54E98A] focus:ring-0 cursor-pointer"
                                    />
                                    <span className="text-sm text-[#D7E5EC]">Incluir métricas de facturación y total de ventas del día</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* PESTAÑA 2: CONFIGURACIÓN DE DISEÑO / APARIENCIA */}
                {activeTab === "theme" && (
                    <div className="bg-[#142126] border border-[#3D4A3E] rounded-2xl p-6 sm:p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3D4A3E]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                                <Palette size={21} />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">Personalización Visual y Experiencia</h2>
                                <p className="text-xs text-[#7F9699]">Ajusta la paleta de acentos y la densidad de visualización de los datos.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="mb-3 block text-xs font-semibold tracking-wide text-[#BBCBBB]">
                                    SELECCIONAR TONO DE ACENTO (VERDE DE LA APP)
                                </label>
                                <div className="flex items-center gap-4">
                                    {[
                                        { name: "Esmeralda Neón (Actual)", value: "#54E98A" },
                                        { name: "Verde Menta Suave", value: "#43CD77" },
                                        { name: "Verde Lima Brillante", value: "#34D399" }
                                    ].map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setThemeConfig({...themeConfig, primaryColor: color.value})}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                                themeConfig.primaryColor === color.value 
                                                    ? "border-[#54E98A] bg-[#54E98A]/10 text-white" 
                                                    : "border-[#3D4A3E] bg-[#08151A] text-[#BBCBBB] hover:border-[#718A8F]"
                                            }`}
                                        >
                                            <span className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: color.value }}></span>
                                            <span>{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#3D4A3E]">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]">
                                        DENSIDAD DE LAS TABLAS (VISTA RÁPIDA)
                                    </label>
                                    <select
                                        value={themeConfig.tableDensity}
                                        onChange={(e) => setThemeConfig({...themeConfig, tableDensity: e.target.value})}
                                        className="w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                    >
                                        <option value="normal">Normal (Espaciado estándar)</option>
                                        <option value="compact">Compacta (Más filas visibles a la vez)</option>
                                    </select>
                                    <p className="mt-1.5 text-[11px] text-[#7F9699]">Cambia el relleno vertical de las celdas en productos, ventas y compras.</p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]">
                                        COMPORTAMIENTO DEL MENÚ LATERAL
                                    </label>
                                    <select
                                        value={themeConfig.sidebarState}
                                        onChange={(e) => setThemeConfig({...themeConfig, sidebarState: e.target.value})}
                                        className="w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                    >
                                        <option value="expanded">Siempre expandido (Por defecto)</option>
                                        <option value="fixed">Fijo estándar</option>
                                    </select>
                                    <p className="mt-1.5 text-[11px] text-[#7F9699]">Determina el ancho inicial al cargar el panel de administración.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botón de Guardar General */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#54E98A] px-6 py-3 text-sm font-bold text-[#003919] transition hover:bg-[#70F0A0] shadow-lg shadow-[#54E98A]/10 cursor-pointer"
                    >
                        Guardar Cambios de Configuración
                    </button>
                </div>
            </form>
        </section>
    );
}