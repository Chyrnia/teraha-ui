import ProductForm from "@/components/products/ProductForm.jsx";

export default function CreateProductPage() {
    return (
        <section className="p-6 md:p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-7">
                    <h1 className="text-2xl font-semibold text-white">
                        Nuevo producto
                    </h1>

                    <p className="mt-1 text-sm text-[#8FA4A8]">
                        Registrá un producto en el catálogo.
                    </p>
                </div>

                <ProductForm />
            </div>
        </section>
    );
}
