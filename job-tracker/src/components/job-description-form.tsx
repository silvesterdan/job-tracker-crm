"use client";

import { updateJobDescriptionAction } from "@/app/actions";
import { MarkdownEditor } from "@/components/markdown-editor";

type Props = {
  jobId: string;
  defaultValue: string;
};

export function JobDescriptionForm({ jobId, defaultValue }: Props) {
  return (
    <form action={updateJobDescriptionAction} className="mt-3 grid gap-3">
      <input type="hidden" name="jobId" value={jobId} />
      <MarkdownEditor
        name="description"
        defaultValue={defaultValue}
        placeholder="Job description... (supports **bold**, *italic*, - bullets)"
      />
      <button type="submit" className="w-fit rounded bg-black px-4 py-2 text-sm text-white">
        Save Description
      </button>
    </form>
  );
}
