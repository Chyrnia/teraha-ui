// src/app/dashboard/clients/[id]/page.jsx
import ClientDetails from "@/components/clients/ClientDetails.jsx";

export default async function ClientPage({ params }) {
    const { id } = await params;

    return (
        <section className="p-8">
            <ClientDetails id={id} />
        </section>
    );
}