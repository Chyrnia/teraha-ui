// src/app/dashboard/clients/new/page.jsx
import ClientForm from "@/components/clients/ClientForm.jsx";

export default function NewClientPage() {
    return (
        <section className="p-6 md:p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-7">
                    <h1 className="text-2xl font-semibold text-white">
                        Agregar cliente
                    </h1>

                    <p className="mt-1 text-sm text-[#8FA4A8]">
                        Registrá un nuevo cliente en el sistema.
                    </p>
                </div>

                <ClientForm mode="create" />
            </div>
        </section>
    );
}