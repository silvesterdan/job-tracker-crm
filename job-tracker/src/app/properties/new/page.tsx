import Link from "next/link";
import { createPropertyAction } from "@/app/actions";

type NewPropertyPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewPropertyPage({ searchParams }: NewPropertyPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/properties" className="text-sm underline">
        Back to Properties
      </Link>
      <h1 className="mt-4 text-3xl font-bold">New Property</h1>
      <p className="mt-2 text-sm text-zinc-600">Create a property record for future jobs.</p>

      {error && <p className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form action={createPropertyAction} className="mt-6 grid gap-3">
        <label className="grid gap-1 text-sm">
          <span>Address Line *</span>
          <input name="addressLine" required className="rounded border p-2" />
        </label>

        <label className="grid gap-1 text-sm">
          <span>City *</span>
          <input name="city" required className="rounded border p-2" />
        </label>

        <label className="grid gap-1 text-sm">
          <span>Postcode</span>
          <input name="postcode" className="rounded border p-2" />
        </label>

        <label className="grid gap-1 text-sm">
          <span>Access Notes</span>
          <textarea name="accessNotes" className="min-h-24 rounded border p-2" />
        </label>

        <button type="submit" className="w-fit rounded bg-black px-4 py-2 text-white">
          Create Property
        </button>
      </form>
    </main>
  );
}
