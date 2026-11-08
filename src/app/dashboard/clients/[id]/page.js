// src/app/dashboard/clients/[id]/page.jsx
import ClientDetails from "@/components/clients/ClientDetails.jsx";

export default async function ClientPage({ params }) {
    const { id } = await params;

    return (
        <section className="p-6 md:p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-7">
                    <h1 className="text-2xl font-semibold text-white">
                        Cliente
                    </h1>

                    <p className="mt-1 text-sm text-[#8FA4A8]">
                        Información detallada del cliente.
                    </p>
                </div>

                <ClientDetails id={id} />
            </div>
        </section>
    );
}