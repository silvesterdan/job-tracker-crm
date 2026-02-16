import Link from "next/link";
import { prisma } from "@/lib/prisma";

type PropertiesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const properties = await prisma.property.findMany({
    where:
      query === ""
        ? undefined
        : {
            OR: [
              { addressLine: { contains: query, mode: "insensitive" } },
              { postcode: { contains: query, mode: "insensitive" } },
            ],
          },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="mt-2 text-sm text-zinc-600">Search by address line or postcode.</p>
        </div>
        <Link href="/properties/new" className="rounded bg-black px-4 py-2 text-sm text-white">
          New Property
        </Link>
      </div>

      <section className="mt-6 rounded-lg border border-zinc-200 p-4">
        <form className="flex flex-col gap-2 sm:flex-row">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search address or postcode"
            className="w-full rounded border p-2"
          />
          <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">
            Search
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-lg border border-zinc-200">
        <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-zinc-200 px-4 py-3 text-sm font-semibold">
          <span>Address</span>
          <span>Postcode</span>
        </div>
        <ul>
          {properties.map((property) => (
            <li key={property.id} className="grid grid-cols-[1fr_auto] gap-2 border-b border-zinc-100 px-4 py-3 text-sm last:border-b-0">
              <Link href={`/properties/${property.id}`} className="underline">
                {property.addressLine}
              </Link>
              <span>{property.postcode ?? "-"}</span>
            </li>
          ))}
          {properties.length === 0 && <li className="px-4 py-4 text-sm text-zinc-500">No properties found.</li>}
        </ul>
      </section>
    </main>
  );
}
