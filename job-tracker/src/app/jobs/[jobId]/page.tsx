import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddPaintRecordForm } from "@/components/add-paint-record-form";
import { JobDescriptionForm } from "@/components/job-description-form";
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
      <section className="mt-6 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">Description</h2>
        <JobDescriptionForm jobId={job.id} defaultValue={job.description ?? ""} />
      </section>

      <div className="mt-8">
        <AddPaintRecordForm jobId={job.id} />
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Paint Records</h2>
        <ul className="mt-3 grid gap-4">
          {job.paintRecords.map((record) => (
            <li key={record.id} className="rounded border border-zinc-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{record.area}</p>
                <Link
                  href={`/jobs/${job.id}/paint-records/${record.id}/edit`}
                  className="shrink-0 text-sm underline"
                >
                  Edit
                </Link>
              </div>
              <p className="text-sm text-zinc-600">
                {[record.brand, record.productName, record.colourName, record.colourCode, record.finish]
                  .filter(Boolean)
                  .join(" | ") || "No paint details provided"}
              </p>
              {record.shopName && (
                <p className="mt-1 text-sm text-zinc-500">Shop: {record.shopName}</p>
              )}
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
