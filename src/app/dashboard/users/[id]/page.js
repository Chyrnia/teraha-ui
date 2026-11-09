// src/app/dashboard/users/[id]/page.jsx
import { use } from "react";
import UserDetails from "@/components/users/UserDetails.jsx";

export default function UserDetailPage({ params }) {
    const resolvedParams = use(params);
    return (
        <section className="p-8">
            <UserDetails id={resolvedParams.id} />
        </section>
    );
}