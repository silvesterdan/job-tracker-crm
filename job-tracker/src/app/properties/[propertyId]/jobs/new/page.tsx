import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JobForm } from "./job-form";

type NewJobPageProps = {
  params: Promise<{ propertyId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function NewJobPage({ params, searchParams }: NewJobPageProps) {
  const { propertyId } = await params;
  const { error } = await searchParams;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, addressLine: true, postcode: true },
  });

  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href={`/properties/${property.id}`} className="text-sm underline">
        Back to Property
      </Link>

      <h1 className="mt-4 text-3xl font-bold">Add Job</h1>
      <p className="mt-2 text-sm text-zinc-600">
        {property.addressLine} | {property.postcode ?? "-"}
      </p>

      {error && <p className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <JobForm propertyId={property.id} />
    </main>
  );
}
