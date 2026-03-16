"use client";

import { useState, useTransition } from "react";
import { updateJobDescriptionAction } from "@/app/actions";
import { MarkdownEditor } from "@/components/markdown-editor";
import { MarkdownContent } from "@/components/markdown-content";

type Props = {
  jobId: string;
  defaultValue: string;
};

export function JobDescriptionForm({ jobId, defaultValue }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateJobDescriptionAction(formData);
      const saved = formData.get("description");
      setDescription(typeof saved === "string" ? saved.trim() : "");
      setIsEditing(false);
    });
  }

  if (!isEditing) {
    return (
      <div className="mt-2">
        {description ? (
          <div className="text-sm text-zinc-800">
            <MarkdownContent>{description}</MarkdownContent>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No description yet.</p>
        )}
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-3 text-sm underline"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="mt-2 grid gap-3">
      <input type="hidden" name="jobId" value={jobId} />
      <MarkdownEditor
        name="description"
        defaultValue={description}
        placeholder="Job description... (supports **bold**, *italic*, - bullets)"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-fit rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-sm underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
