import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePaintRecordAction } from "@/app/actions";
import { prisma } from "@/lib/prisma";

type EditPaintRecordPageProps = {
  params: Promise<{ jobId: string; recordId: string }>;
};

export default async function EditPaintRecordPage({ params }: EditPaintRecordPageProps) {
  const { jobId, recordId } = await params;

  const record = await prisma.paintRecord.findUnique({
    where: { id: recordId },
    include: { job: { include: { property: true } } },
  });

  if (!record || record.jobId !== jobId) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href={`/jobs/${jobId}`} className="text-sm underline">
        Back to Job
      </Link>

      <h1 className="mt-4 text-3xl font-bold">Edit Paint Record</h1>
      <p className="mt-1 text-sm text-zinc-600">
        {record.job.property.addressLine} | {record.job.title}
      </p>

      <form action={updatePaintRecordAction} encType="multipart/form-data" className="mt-6 grid gap-4">
        <input type="hidden" name="recordId" value={record.id} />
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="existingPhotoPath" value={record.photoPath ?? ""} />

        <label className="grid gap-1 text-sm">
          <span>Area *</span>
          <input name="area" required defaultValue={record.area} className="rounded border p-2" />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span>Brand</span>
            <input name="brand" defaultValue={record.brand ?? ""} className="rounded border p-2" />
          </label>

          <label className="grid gap-1 text-sm">
            <span>Product name</span>
            <input name="productName" defaultValue={record.productName ?? ""} className="rounded border p-2" />
          </label>

          <label className="grid gap-1 text-sm">
            <span>Colour name</span>
            <input name="colourName" defaultValue={record.colourName ?? ""} className="rounded border p-2" />
          </label>

          <label className="grid gap-1 text-sm">
            <span>Colour code</span>
            <input name="colourCode" defaultValue={record.colourCode ?? ""} className="rounded border p-2" />
          </label>

          <label className="grid gap-1 text-sm">
            <span>Finish</span>
            <input name="finish" defaultValue={record.finish ?? ""} className="rounded border p-2" />
          </label>

          <label className="grid gap-1 text-sm">
            <span>Shop name / address</span>
            <input name="shopName" defaultValue={record.shopName ?? ""} className="rounded border p-2" />
          </label>
        </div>

        <label className="grid gap-1 text-sm">
          <span>Notes</span>
          <textarea name="notes" defaultValue={record.notes ?? ""} className="min-h-24 rounded border p-2" />
        </label>

        <div className="grid gap-1 text-sm">
          <span>Photo</span>
          {record.photoPath && (
            <div className="mb-2">
              <p className="mb-1 text-xs text-zinc-500">Current photo (upload a new one to replace it):</p>
              <Image
                src={record.photoPath}
                alt={`Paint can for ${record.area}`}
                width={300}
                height={225}
                className="h-auto w-full max-w-xs rounded border"
              />
            </div>
          )}
          <input name="photo" type="file" accept="image/*" className="rounded border p-2" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="w-fit rounded bg-black px-4 py-2 text-white">
            Save Changes
          </button>
          <Link href={`/jobs/${jobId}`} className="rounded border border-zinc-300 px-4 py-2 text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
