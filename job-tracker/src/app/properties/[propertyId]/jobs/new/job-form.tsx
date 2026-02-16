"use client";

import { useState } from "react";
import { createJobWithPaintRecordsAction } from "@/app/actions";

type JobFormProps = {
  propertyId: string;
};

export function JobForm({ propertyId }: JobFormProps) {
  const [recordIds, setRecordIds] = useState<number[]>([]);
  const [nextRecordId, setNextRecordId] = useState(0);

  function addRecord() {
    if (recordIds.length >= 3) {
      return;
    }

    setRecordIds((current) => [...current, nextRecordId]);
    setNextRecordId((current) => current + 1);
  }

  function removeRecord(recordId: number) {
    setRecordIds((current) => current.filter((id) => id !== recordId));
  }

  return (
    <form action={createJobWithPaintRecordsAction} className="mt-6 grid gap-4">
      <input type="hidden" name="propertyId" value={propertyId} />

      <label className="grid gap-1 text-sm">
        <span>Job Date *</span>
        <input name="jobDate" type="date" required className="rounded border p-2" />
      </label>

      <label className="grid gap-1 text-sm">
        <span>Summary *</span>
        <input name="summary" required className="rounded border p-2" />
      </label>

      <label className="grid gap-1 text-sm">
        <span>Notes</span>
        <textarea name="notes" className="min-h-24 rounded border p-2" />
      </label>

      <section className="rounded border border-zinc-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Paint Records</h2>
          <button
            type="button"
            onClick={addRecord}
            disabled={recordIds.length >= 3}
            className="rounded border border-zinc-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add another paint record
          </button>
        </div>

        {recordIds.length === 0 && <p className="mt-3 text-sm text-zinc-600">No paint records added.</p>}

        <div className="mt-4 grid gap-4">
          {recordIds.map((recordId, index) => (
            <div key={recordId} className="rounded border border-zinc-200 p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium">Paint Record {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeRecord(recordId)}
                  className="text-sm text-zinc-700 underline"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span>Room *</span>
                  <input name={`paintRecords.${recordId}.room`} className="rounded border p-2" />
                </label>

                <label className="grid gap-1 text-sm">
                  <span>Colour *</span>
                  <input name={`paintRecords.${recordId}.colour`} className="rounded border p-2" />
                </label>

                <label className="grid gap-1 text-sm">
                  <span>Brand</span>
                  <input name={`paintRecords.${recordId}.brand`} className="rounded border p-2" />
                </label>

                <label className="grid gap-1 text-sm">
                  <span>Finish</span>
                  <input name={`paintRecords.${recordId}.finish`} className="rounded border p-2" />
                </label>

                <label className="grid gap-1 text-sm md:col-span-2">
                  <span>Notes</span>
                  <textarea name={`paintRecords.${recordId}.notes`} className="min-h-20 rounded border p-2" />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button type="submit" className="w-fit rounded bg-black px-4 py-2 text-white">
        Save Job
      </button>
    </form>
  );
}
