
import EditProductClient from "@/components/products/EditProductClient.jsx";

export default async function EditProductPage({ params }) {
    const { id } = await params;

    return (
        <section className="p-6 md:p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-7">
                    <h1 className="text-2xl font-semibold text-white">
                        Editar producto
                    </h1>

                    <p className="mt-1 text-sm text-[#8FA4A8]">
                        Modificá los datos del producto.
                    </p>
                </div>

                <EditProductClient id={id} />
            </div>
        </section>
    );
}

