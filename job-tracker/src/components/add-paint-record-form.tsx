"use client";

import { useState } from "react";
import { createPaintRecordAction } from "@/app/actions";

type Props = {
  jobId: string;
};

export function AddPaintRecordForm({ jobId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded bg-black px-4 py-2 text-sm text-white"
      >
        + Add Paint Record
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Add Paint Record</h2>
          <p className="mt-1 text-sm text-zinc-600">Attach up to one paint can photo per record (optional).</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-sm underline"
        >
          Cancel
        </button>
      </div>
      <form action={createPaintRecordAction} encType="multipart/form-data" className="mt-4 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="jobId" value={jobId} />
        <input name="area" required placeholder="Area (e.g. Kitchen walls)" className="rounded border p-2" />
        <input name="brand" placeholder="Brand (optional)" className="rounded border p-2" />
        <input name="productName" placeholder="Product name (optional)" className="rounded border p-2" />
        <input name="colourName" placeholder="Colour name (optional)" className="rounded border p-2" />
        <input name="colourCode" placeholder="Colour code (optional)" className="rounded border p-2" />
        <input name="finish" placeholder="Finish (optional)" className="rounded border p-2" />
        <input name="shopName" placeholder="Shop name / address (optional)" className="rounded border p-2 md:col-span-2" />
        <input name="photo" type="file" accept="image/*" className="rounded border p-2 md:col-span-2" />
        <textarea name="notes" placeholder="Notes (optional)" className="rounded border p-2 md:col-span-2" />
        <button type="submit" className="w-fit rounded bg-black px-4 py-2 text-white">
          Save Paint Record
        </button>
      </form>
    </div>
  );
}
