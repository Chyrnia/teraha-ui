import ProductDetails from "@/components/products/ProductDetails.jsx";

export default async function ProductPage({ params }) {
    const { id } = await params;

    return (
        <section className="p-6 md:p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-7">
                    <h1 className="text-2xl font-semibold text-white">
                        Producto
                    </h1>

                    <p className="mt-1 text-sm text-[#8FA4A8]">
                        Información y asociaciones del producto.
                    </p>
                </div>

                <ProductDetails id={id} />
            </div>
        </section>
    );
}
