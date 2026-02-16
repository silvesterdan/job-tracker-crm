import Link from "next/link";
import { notFound } from "next/navigation";
import { updateAccessNotesAction } from "@/app/actions";
import { prisma } from "@/lib/prisma";

type PropertyPageProps = {
  params: Promise<{ propertyId: string }>;
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { propertyId } = await params;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      jobs: {
        orderBy: { jobDate: "desc" },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const latestPaintByRoom = await prisma.$queryRaw<
    Array<{
      room: string;
      colour: string | null;
      brand: string | null;
      finish: string | null;
      jobDate: Date;
    }>
  >`
    SELECT DISTINCT ON (pr."area")
      pr."area" AS "room",
      COALESCE(pr."colourName", pr."colourCode") AS "colour",
      pr."brand" AS "brand",
      pr."finish" AS "finish",
      j."jobDate" AS "jobDate"
    FROM "PaintRecord" pr
    INNER JOIN "Job" j ON j."id" = pr."jobId"
    WHERE j."propertyId" = ${propertyId}
    ORDER BY pr."area" ASC, j."jobDate" DESC, pr."createdAt" DESC
  `;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/properties" className="text-sm underline">
        Back to Properties
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{property.addressLine}</h1>
          <p className="text-sm text-zinc-600">{property.postcode ?? "-"}</p>
        </div>
        <Link href={`/properties/${property.id}/jobs/new`} className="rounded bg-black px-4 py-2 text-sm text-white">
          Add Job
        </Link>
      </div>

      <section className="mt-8 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">Access / Key Notes</h2>
        <form action={updateAccessNotesAction} className="mt-3 grid gap-3">
          <input type="hidden" name="propertyId" value={property.id} />
          <textarea
            name="accessNotes"
            defaultValue={property.accessNotes ?? ""}
            placeholder="Door codes, key locations, lockbox details..."
            className="min-h-28 rounded border p-2"
          />
          <button type="submit" className="w-fit rounded bg-black px-4 py-2 text-white">
            Save Notes
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">Latest Paint by Room</h2>
        <ul className="mt-3 grid gap-3">
          {latestPaintByRoom.map((record) => (
            <li key={record.room} className="rounded border border-zinc-200 p-4">
              <p className="font-medium">{record.room}</p>
              <p className="text-sm text-zinc-700">Colour: {record.colour ?? "-"}</p>
              <p className="text-sm text-zinc-600">
                {[record.brand, record.finish].filter(Boolean).join(" | ") || "Brand/finish not set"}
              </p>
              <p className="mt-1 text-xs text-zinc-500">From job date: {record.jobDate.toLocaleDateString()}</p>
            </li>
          ))}
          {latestPaintByRoom.length === 0 && <li className="text-sm text-zinc-500">No paint records yet.</li>}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Job History</h2>
        <ul className="mt-3 grid gap-3">
          {property.jobs.map((job) => (
            <li key={job.id} className="rounded border border-zinc-200 p-4">
              <p className="text-sm text-zinc-600">{job.jobDate.toLocaleDateString()}</p>
              <p className="mt-1 font-medium">Summary: {job.title}</p>
              {job.description && (
                <p className="mt-1 text-sm text-zinc-700">
                  Notes: {job.description.length > 140 ? `${job.description.slice(0, 140)}...` : job.description}
                </p>
              )}
              <Link href={`/jobs/${job.id}`} className="mt-2 inline-block text-sm underline">
                View job details
              </Link>
            </li>
          ))}
          {property.jobs.length === 0 && <li className="text-sm text-zinc-500">No jobs yet.</li>}
        </ul>
      </section>
    </main>
  );
}
