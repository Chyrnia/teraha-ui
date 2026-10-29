"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Boxes,
    CircleAlert,
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    UserRound,
} from "lucide-react";
import { login } from "@/lib/auth.js";

export default function LoginForm() {
    const router = useRouter();

    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        setLoginForm((current) => ({
            ...current,
            [name]: value,
        }));

        if (error) setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        try {
            await login(loginForm);
            router.replace("/dashboard");
        } catch (err) {
            if (
                err instanceof Error &&
                /Status code:\s*401/.test(err.message)
            ) {
                setError("Usuario o contraseña incorrectos.");
            } else if (err instanceof TypeError) {
                setError("No se pudo conectar con el servidor.");
            } else {
                setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08151A] px-5 py-10 text-[#D7E5EC]">
            {/* Subtle background lighting */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute -top-48 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#54E98A]/[0.07] blur-[120px]" />
                <div className="absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-[#354C56]/20 blur-[120px]" />
            </div>

            <section className="relative w-full max-w-[410px]">
                {/* Branding */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#54E98A]/20 bg-[#54E98A]/[0.08] text-[#54E98A]">
                        <Boxes size={28} strokeWidth={1.7} />
                    </div>

                    <h1 className="text-xl font-bold tracking-[0.2em] text-white">
                        TERAHA
                    </h1>
                </div>

                {/* Login card */}
                <div className="rounded-2xl border border-[#3D4A3E]/80 bg-[#142126] p-7 shadow-2xl shadow-black/20 sm:p-9">
                    <div className="mb-8">
                        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#54E98A]">
                            INICIAR SESIÓN
                        </p>

                        <h2 className="text-2xl font-semibold tracking-tight text-white">
                            Bienvenido de nuevo
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#8FA4A8]">
                            Ingresa tus credenciales para continuar.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="text-sm font-medium text-[#D7E5EC]"
                            >
                                Usuario
                            </label>

                            <div className="relative mt-2">
                                <UserRound
                                    size={18}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718A8F]"
                                />

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={loginForm.username}
                                    onChange={handleChange}
                                    placeholder="Nombre de usuario"
                                    autoComplete="username"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-[#354C56] bg-[#08151A] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[#5F777D] focus:border-[#54E98A] focus:ring-2 focus:ring-[#54E98A]/10 disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-[#D7E5EC]"
                            >
                                Contraseña
                            </label>

                            <div className="relative mt-2">
                                <LockKeyhole
                                    size={18}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718A8F]"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={loginForm.password}
                                    onChange={handleChange}
                                    placeholder="Contraseña"
                                    autoComplete="current-password"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-[#354C56] bg-[#08151A] py-3 pl-10 pr-12 text-sm text-white outline-none transition placeholder:text-[#5F777D] focus:border-[#54E98A] focus:ring-2 focus:ring-[#54E98A]/10 disabled:opacity-60"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((current) => !current)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#718A8F] transition hover:text-[#54E98A] focus-visible:outline-2 focus-visible:outline-[#54E98A]"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-2.5 rounded-lg border border-red-400/20 bg-red-400/[0.07] p-3 text-sm leading-5 text-red-200"
                            >
                                <CircleAlert
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#54E98A] px-4 py-3 text-sm font-semibold text-[#003919] transition hover:bg-[#70F0A0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#54E98A] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    Iniciar sesión
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-[#5F777D]">
                    TERAHA <span className="mx-1.5 text-[#354C56]">/</span>
                    Sistema de gestión
                </p>
            </section>
        </main>
    );
}
