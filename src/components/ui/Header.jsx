// src/components/ui/Header.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Bell, 
    CircleUserRound, 
    Settings, 
    LogOut,
    X,
    Mail,
    Send,
    CheckCircle2,
    MessageSquare,
    HelpCircle
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth'; // <--- Importamos tu función helper

export default function Header(){
    const router = useRouter();
    
    // Estados para menús desplegables y modales
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [supportModalOpen, setSupportModalOpen] = useState(false);
    
    // Estado para la información del usuario usando el helper
    const [currentUser, setCurrentUser] = useState({ name: "Retail Manager", email: "" });

    // Estados del formulario de soporte
    const [supportSubject, setSupportSubject] = useState("");
    const [supportMessage, setSupportMessage] = useState("");
    const [supportSent, setSupportSent] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const userDropdownRef = useRef(null);

    // Cargar datos reales del usuario al montar el componente
    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        router.push("/login");
    };

    const handleSendSupport = (e) => {
        e.preventDefault();
        if (!supportMessage.trim()) return;

        setIsSending(true);

        setTimeout(() => {
            setIsSending(false);
            setSupportSent(true);
            setSupportSubject("");
            setSupportMessage("");

            setTimeout(() => {
                setSupportSent(false);
                setSupportModalOpen(false);
            }, 2500);
        }, 800);
    };

    return(
        <>
            <div className="flex flex-row items-center h-16 px-6 border-b bg-[#142126] border-[#3D4A3E] relative z-40">
                <div className="brand text-2xl font-semibold text-[#54E98A]">
                    <h2>Teraha</h2>
                </div>

                <div className="actions flex flex-row ml-auto gap-4 items-center">
                    {/* Botón Notificaciones */}
                    <button 
                        aria-label="Notificaciones" 
                        className="text-[#BBCBBB] p-2 rounded-md hover:bg-[#54E98A0D] hover:text-[#54E98A] cursor-pointer transition-colors"
                    >
                        <Bell size={26} />
                    </button>

                    {/* BOTÓN INTERROGACIÓN - SOPORTE TÉCNICO */}
                    <button 
                        aria-label="Ayuda y Soporte" 
                        onClick={() => setSupportModalOpen(true)}
                        className={`text-[#BBCBBB] p-2 rounded-md hover:bg-[#54E98A0D] hover:text-[#54E98A] transition-colors cursor-pointer ${
                            supportModalOpen ? "text-[#54E98A] bg-[#54E98A]/10" : ""
                        }`}
                        title="Contactar a Soporte"
                    >
                        <HelpCircle size={26} />
                    </button>

                    {/* Menú Desplegable de Perfil */}
                    <div className="relative" ref={userDropdownRef}>
                        <button 
                            aria-label="Perfil" 
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className={`text-[#BBCBBB] p-2 rounded-md hover:bg-[#54E98A0D] hover:text-[#54E98A] transition-colors cursor-pointer ${
                                userDropdownOpen ? "text-[#54E98A] bg-[#54E98A]/10" : ""
                            }`}
                        >
                            <CircleUserRound size={26}/>
                        </button>

                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-[#142126] border border-[#3D4A3E] rounded-xl shadow-2xl overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-[#3D4A3E]">
                                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                                    <p className="text-[11px] text-[#54E98A] truncate">{currentUser.email || "Sesión Activa"}</p>
                                </div>

                                <div className="p-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserDropdownOpen(false);
                                            router.push("/dashboard/settings");
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#BBCBBB] hover:text-white hover:bg-[#354C56]/40 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Settings size={16} />
                                        <span>Configuración</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL FLOTANTE DE SOPORTE TÉCNICO */}
            {supportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#3D4A3E] bg-[#142126] shadow-2xl">
                        {/* Header del Modal */}
                        <div className="flex items-center justify-between border-b border-[#3D4A3E] bg-[#101D22]/80 px-6 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                                    <HelpCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Centro de Soporte y Ayuda</h3>
                                    <p className="text-[11px] text-[#7F9699]">¿Tienes alguna duda o inconveniente técnico?</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSupportModalOpen(false)}
                                className="rounded-lg p-1 text-[#BBCBBB] hover:bg-[#354C56]/50 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cuerpo del Modal */}
                        <div className="p-6 space-y-5">
                            {supportSent ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#54E98A]/20 text-[#54E98A]">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h4 className="text-base font-semibold text-white">¡Mensaje Enviado!</h4>
                                    <p className="text-xs text-[#BBCBBB] max-w-xs">
                                        Hemos recibido tu consulta. Un miembro de nuestro equipo técnico te responderá a la brevedad.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Canales Directos */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <a
                                            href="mailto:soporte@teraha.com"
                                            className="flex items-center gap-3 p-3 rounded-xl border border-[#354C56] bg-[#08151A] hover:border-[#54E98A]/40 transition-all group"
                                        >
                                            <Mail size={18} className="text-[#54E98A] group-hover:scale-110 transition-transform" />
                                            <div className="text-left overflow-hidden">
                                                <p className="text-[10px] text-[#7F9699]">Correo Electrónico</p>
                                                <p className="text-xs font-semibold text-[#D7E5EC] truncate">soporte@teraha.com</p>
                                            </div>
                                        </a>

                                        <a
                                            href="https://wa.me/595986269811"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl border border-[#354C56] bg-[#08151A] hover:border-[#54E98A]/40 transition-all group"
                                        >
                                            <MessageSquare size={18} className="text-[#54E98A] group-hover:scale-110 transition-transform" />
                                            <div className="text-left overflow-hidden">
                                                <p className="text-[10px] text-[#7F9699]">WhatsApp Directo</p>
                                                <p className="text-xs font-semibold text-[#D7E5EC] truncate">+595 986 269811</p>
                                            </div>
                                        </a>
                                    </div>

                                    {/* Formulario de Contacto */}
                                    <form onSubmit={handleSendSupport} className="space-y-4 pt-2 border-t border-[#3D4A3E]">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-[#BBCBBB]">
                                                ASUNTO
                                            </label>
                                            <input
                                                type="text"
                                                value={supportSubject}
                                                onChange={(e) => setSupportSubject(e.target.value)}
                                                placeholder="Ej. Problema al generar reporte / Error en inventario"
                                                required
                                                className="w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-2.5 text-xs text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-[#BBCBBB]">
                                                DESCRIPCIÓN DE LA CONSULTA O INCONVENIENTE
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={supportMessage}
                                                onChange={(e) => setSupportMessage(e.target.value)}
                                                placeholder="Describe lo que necesitas o detallanos el comportamiento del sistema..."
                                                required
                                                className="w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-2.5 text-xs text-[#D7E5EC] outline-none focus:border-[#54E98A]"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setSupportModalOpen(false)}
                                                className="rounded-lg border border-[#3D4A3E] px-4 py-2 text-xs font-medium text-[#BBCBBB] hover:border-[#718A8F] hover:text-white transition-colors cursor-pointer"
                                            >
                                                Cancelar
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isSending}
                                                className="inline-flex items-center gap-2 rounded-lg bg-[#54E98A] px-4 py-2 text-xs font-semibold text-[#003919] hover:bg-[#70F0A0] transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                <Send size={14} />
                                                {isSending ? "Enviando..." : "Enviar consulta"}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}