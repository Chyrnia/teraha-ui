"use client";

import { useEffect, useState } from "react";
import {
    Mail,
    Palette,
    CheckCircle2,
    LoaderCircle,
    AlertCircle
} from "lucide-react";

import { hasRole } from "@/lib/auth.js";
import {
    getEmailSettings,
    updateEmailSettings,
    getAppearanceSettings,
    updateAppearanceSettings
} from "@/lib/settings.js";

const INITIAL_EMAIL_CONFIG = {
    senderEmail: "",
    recipients: "",
    frequency: "DAILY_AT_CLOSE",
    defaultMessage: "",
    includeLowStock: true,
    includeSalesMetrics: true
};

const INITIAL_APPEARANCE_CONFIG = {
    accentColor: "EMERALD_NEON",
    tableDensity: "NORMAL",
    sidebarBehavior: "EXPANDED"
};

const ACCENT_COLORS = [
    {
        name: "Esmeralda Neón",
        value: "EMERALD_NEON",
        color: "#54E98A"
    },
    {
        name: "Verde Menta",
        value: "MINT_GREEN",
        color: "#43CD77"
    },
    {
        name: "Verde Lima",
        value: "LIME_GREEN",
        color: "#34D399"
    }
];

function emailSettingsToForm(settings) {
    return {
        senderEmail: settings.senderEmail ?? "",
        recipients: (settings.recipients ?? []).join(", "),
        frequency: settings.frequency ?? "DAILY_AT_CLOSE",
        defaultMessage: settings.defaultMessage ?? "",
        includeLowStock: settings.includeLowStock ?? true,
        includeSalesMetrics: settings.includeSalesMetrics ?? true
    };
}

function appearanceSettingsToForm(settings) {
    return {
        accentColor: settings.accentColor ?? "EMERALD_NEON",
        tableDensity: settings.tableDensity ?? "NORMAL",
        sidebarBehavior: settings.sidebarBehavior ?? "EXPANDED"
    };
}

export default function SettingsPage() {
    const [isSysadmin, setIsSysadmin] = useState(null);
    const [activeTab, setActiveTab] = useState("appearance");

    const [emailConfig, setEmailConfig] = useState(INITIAL_EMAIL_CONFIG);
    const [themeConfig, setThemeConfig] = useState(
        INITIAL_APPEARANCE_CONFIG
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // Resolve the role in the browser, where sessionStorage is available.
    useEffect(() => {
        const admin = hasRole("ROLE_SYSADMIN");

        setIsSysadmin(admin);

        if (admin) {
            setActiveTab("email");
        }
    }, []);

    // Load the settings belonging to the currently selected tab.
    useEffect(() => {
        if (isSysadmin === null) return;

        let cancelled = false;

        async function loadSettings() {
            setLoading(true);
            setError("");
            setSaved(false);

            try {
                if (activeTab === "email" && isSysadmin) {
                    const settings = await getEmailSettings();

                    if (!cancelled) {
                        setEmailConfig(emailSettingsToForm(settings));
                    }
                } else {
                    const settings = await getAppearanceSettings();

                    if (!cancelled) {
                        setThemeConfig(
                            appearanceSettingsToForm(settings)
                        );
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "No se pudo cargar la configuración.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadSettings();

        return () => {
            cancelled = true;
        };
    }, [activeTab, isSysadmin]);

    async function handleSave(event) {
        event.preventDefault();

        setSaving(true);
        setSaved(false);
        setError("");

        try {
            if (activeTab === "email") {
                const payload = {
                    ...emailConfig,
                    recipients: emailConfig.recipients
                        .split(",")
                        .map(email => email.trim())
                        .filter(Boolean)
                };

                const updated = await updateEmailSettings(payload);

                setEmailConfig(emailSettingsToForm(updated));
            } else {
                const updated = await updateAppearanceSettings(themeConfig);

                setThemeConfig(appearanceSettingsToForm(updated));
            }

            setSaved(true);
        } catch (err) {
            setError(err.message || "No se pudo guardar la configuración.");
        } finally {
            setSaving(false);
        }
    }

    const inputClass =
        "w-full rounded-lg border border-[#354C56] bg-[#08151A] px-3.5 py-3 text-sm text-[#D7E5EC] outline-none focus:border-[#54E98A]";

    const labelClass =
        "mb-2 block text-xs font-semibold tracking-wide text-[#BBCBBB]";

    return (
        <section className="w-full p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#D7E5EC]">
                    Configuraciones del Sistema
                </h1>

                <p className="mt-1 text-xs text-[#7F9699]">
                    Personaliza las alertas por correo y la apariencia visual
                    de la plataforma.
                </p>
            </div>

            {/* Feedback */}
            {saved && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#54E98A] bg-[#54E98A]/10 p-4 text-sm font-medium text-[#54E98A]">
                    <CheckCircle2 size={18} />
                    ¡Configuración guardada exitosamente!
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400"
                >
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Tabs */}
            <div className="mb-6 flex gap-2 border-b border-[#3D4A3E]">
                {isSysadmin && (
                    <button
                        type="button"
                        onClick={() => setActiveTab("email")}
                        className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 pb-3 text-sm font-semibold transition-colors ${
                            activeTab === "email"
                                ? "border-[#54E98A] text-[#54E98A]"
                                : "border-transparent text-[#BBCBBB] hover:text-white"
                        }`}
                    >
                        <Mail size={18} />
                        <span>Envío de Correos</span>
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => setActiveTab("appearance")}
                    className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 pb-3 text-sm font-semibold transition-colors ${
                        activeTab === "appearance"
                            ? "border-[#54E98A] text-[#54E98A]"
                            : "border-transparent text-[#BBCBBB] hover:text-white"
                    }`}
                >
                    <Palette size={18} />
                    <span>Apariencia y Estilo</span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#3D4A3E] bg-[#142126] p-10 text-sm text-[#BBCBBB]">
                    <LoaderCircle size={20} className="animate-spin" />
                    Cargando configuración...
                </div>
            ) : (
                <form onSubmit={handleSave} className="space-y-6">

                    {/* EMAIL SETTINGS */}
                    {activeTab === "email" && isSysadmin && (
                        <div className="rounded-2xl border border-[#3D4A3E] bg-[#142126] p-6 shadow-xl sm:p-8">
                            <div className="mb-6 flex items-center gap-3 border-b border-[#3D4A3E] pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                                    <Mail size={21} />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-white">
                                        Automatización de Reportes por Correo
                                    </h2>
                                    <p className="text-xs text-[#7F9699]">
                                        Define quiénes reciben los resúmenes,
                                        frecuencia y contenido del mensaje.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>
                                            CORREO REMITENTE (DESDE)
                                        </label>

                                        <input
                                            type="email"
                                            required
                                            value={emailConfig.senderEmail}
                                            onChange={e =>
                                                setEmailConfig({
                                                    ...emailConfig,
                                                    senderEmail: e.target.value
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            FRECUENCIA DE ENVÍO
                                        </label>

                                        <select
                                            value={emailConfig.frequency}
                                            onChange={e =>
                                                setEmailConfig({
                                                    ...emailConfig,
                                                    frequency: e.target.value
                                                })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="DAILY_AT_CLOSE">
                                                Resumen diario (al cierre)
                                            </option>
                                            <option value="WEEKLY">
                                                Resumen semanal
                                            </option>
                                            <option value="MONTHLY">
                                                Resumen mensual
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        DESTINATARIOS (SEPARADOS POR COMA)
                                    </label>

                                    <input
                                        type="text"
                                        value={emailConfig.recipients}
                                        onChange={e =>
                                            setEmailConfig({
                                                ...emailConfig,
                                                recipients: e.target.value
                                            })
                                        }
                                        placeholder="gerencia@tienda.com, admin@tienda.com"
                                        className={inputClass}
                                    />

                                    <p className="mt-1.5 text-[11px] text-[#7F9699]">
                                        Puedes agregar varios destinatarios
                                        separados por comas.
                                    </p>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        MENSAJE PREDETERMINADO EN EL CUERPO DEL CORREO
                                    </label>

                                    <textarea
                                        rows={3}
                                        value={emailConfig.defaultMessage}
                                        onChange={e =>
                                            setEmailConfig({
                                                ...emailConfig,
                                                defaultMessage: e.target.value
                                            })
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-3 border-t border-[#3D4A3E] pt-4">
                                    <label className="flex cursor-pointer items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={emailConfig.includeLowStock}
                                            onChange={e =>
                                                setEmailConfig({
                                                    ...emailConfig,
                                                    includeLowStock: e.target.checked
                                                })
                                            }
                                            className="h-4 w-4 cursor-pointer rounded border-[#354C56] bg-[#08151A] text-[#54E98A] focus:ring-0"
                                        />

                                        <span className="text-sm text-[#D7E5EC]">
                                            Incluir alerta automática cuando un
                                            producto tenga stock bajo
                                        </span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={emailConfig.includeSalesMetrics}
                                            onChange={e =>
                                                setEmailConfig({
                                                    ...emailConfig,
                                                    includeSalesMetrics: e.target.checked
                                                })
                                            }
                                            className="h-4 w-4 cursor-pointer rounded border-[#354C56] bg-[#08151A] text-[#54E98A] focus:ring-0"
                                        />

                                        <span className="text-sm text-[#D7E5EC]">
                                            Incluir métricas de facturación y
                                            total de ventas
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* APPEARANCE SETTINGS */}
                    {activeTab === "appearance" && (
                        <div className="rounded-2xl border border-[#3D4A3E] bg-[#142126] p-6 shadow-xl sm:p-8">
                            <div className="mb-6 flex items-center gap-3 border-b border-[#3D4A3E] pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54E98A]/10 text-[#54E98A]">
                                    <Palette size={21} />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-white">
                                        Personalización Visual y Experiencia
                                    </h2>
                                    <p className="text-xs text-[#7F9699]">
                                        Ajusta tus preferencias visuales.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="mb-3 block text-xs font-semibold tracking-wide text-[#BBCBBB]">
                                        SELECCIONAR TONO DE ACENTO
                                    </label>

                                    <div className="flex flex-wrap items-center gap-4">
                                        {ACCENT_COLORS.map(color => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() =>
                                                    setThemeConfig({
                                                        ...themeConfig,
                                                        accentColor: color.value
                                                    })
                                                }
                                                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-all ${
                                                    themeConfig.accentColor === color.value
                                                        ? "border-[#54E98A] bg-[#54E98A]/10 text-white"
                                                        : "border-[#3D4A3E] bg-[#08151A] text-[#BBCBBB] hover:border-[#718A8F]"
                                                }`}
                                            >
                                                <span
                                                    className="h-4 w-4 rounded-full shadow-inner"
                                                    style={{ backgroundColor: color.color }}
                                                />
                                                <span>{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 border-t border-[#3D4A3E] pt-4 sm:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>
                                            DENSIDAD DE LAS TABLAS
                                        </label>

                                        <select
                                            value={themeConfig.tableDensity}
                                            onChange={e =>
                                                setThemeConfig({
                                                    ...themeConfig,
                                                    tableDensity: e.target.value
                                                })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="COMPACT">
                                                Compacta
                                            </option>
                                            <option value="NORMAL">
                                                Normal
                                            </option>
                                            <option value="COMFORTABLE">
                                                Espaciosa
                                            </option>
                                        </select>

                                        <p className="mt-1.5 text-[11px] text-[#7F9699]">
                                            Controla el espacio vertical de las
                                            filas de las tablas.
                                        </p>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            COMPORTAMIENTO DEL MENÚ LATERAL
                                        </label>

                                        <select
                                            value={themeConfig.sidebarBehavior}
                                            onChange={e =>
                                                setThemeConfig({
                                                    ...themeConfig,
                                                    sidebarBehavior: e.target.value
                                                })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="EXPANDED">
                                                Siempre expandido
                                            </option>
                                            <option value="COLLAPSED">
                                                Siempre contraído
                                            </option>
                                        </select>

                                        <p className="mt-1.5 text-[11px] text-[#7F9699]">
                                            Determina el estado inicial del
                                            menú lateral.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SAVE */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#54E98A] px-6 py-3 text-sm font-bold text-[#003919] shadow-lg shadow-[#54E98A]/10 transition hover:bg-[#70F0A0] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <LoaderCircle size={16} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
