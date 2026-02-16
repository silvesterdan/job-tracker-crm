import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPaintRecordAction } from "@/app/actions";
import { prisma } from "@/lib/prisma";

type JobPageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function JobPage({ params }: JobPageProps) {
  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      property: true,
      paintRecords: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link href={`/properties/${job.propertyId}`} className="text-sm underline">
        Back to Property
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{job.title}</h1>
      <p className="text-sm text-zinc-600">
        {job.property.addressLine}, {job.property.city} | {job.jobDate.toLocaleDateString()}
      </p>
      {job.description && <p className="mt-3">{job.description}</p>}

      <section className="mt-8 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">Add Paint Record</h2>
        <p className="mt-1 text-sm text-zinc-600">Attach up to one paint can photo per record (optional).</p>
        <form action={createPaintRecordAction} encType="multipart/form-data" className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="hidden" name="jobId" value={job.id} />
          <input name="area" required placeholder="Area (e.g. Kitchen walls)" className="rounded border p-2" />
          <input name="brand" placeholder="Brand (optional)" className="rounded border p-2" />
          <input name="productName" placeholder="Product name (optional)" className="rounded border p-2" />
          <input name="colourName" placeholder="Colour name (optional)" className="rounded border p-2" />
          <input name="colourCode" placeholder="Colour code (optional)" className="rounded border p-2" />
          <input name="finish" placeholder="Finish (optional)" className="rounded border p-2" />
          <input name="photo" type="file" accept="image/*" className="rounded border p-2 md:col-span-2" />
          <textarea name="notes" placeholder="Notes (optional)" className="rounded border p-2 md:col-span-2" />
          <button type="submit" className="w-fit rounded bg-black px-4 py-2 text-white">
            Save Paint Record
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Paint Records</h2>
        <ul className="mt-3 grid gap-4">
          {job.paintRecords.map((record) => (
            <li key={record.id} className="rounded border border-zinc-200 p-4">
              <p className="font-medium">{record.area}</p>
              <p className="text-sm text-zinc-600">
                {[record.brand, record.productName, record.colourName, record.colourCode, record.finish]
                  .filter(Boolean)
                  .join(" | ") || "No paint details provided"}
              </p>
              {record.notes && <p className="mt-2 text-sm">{record.notes}</p>}
              {record.photoPath && (
                <div className="mt-3">
                  <Image
                    src={record.photoPath}
                    alt={`Paint can for ${record.area}`}
                    width={400}
                    height={300}
                    className="h-auto w-full max-w-sm rounded border"
                  />
                </div>
              )}
            </li>
          ))}
          {job.paintRecords.length === 0 && <li className="text-sm text-zinc-500">No paint records yet.</li>}
        </ul>
      </section>
    </main>
  );
}
