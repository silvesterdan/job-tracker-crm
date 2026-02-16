"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function requiredString(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("Missing required field.");
  }

  return value.trim();
}

function optionalString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseDate(value: FormDataEntryValue | null): Date {
  const raw = requiredString(value);
  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date.");
  }

  return parsed;
}

type PaintRecordDraft = {
  room: string | null;
  brand: string | null;
  finish: string | null;
  colour: string | null;
  notes: string | null;
};

function parsePaintRecordDrafts(formData: FormData): PaintRecordDraft[] {
  const grouped = new Map<number, PaintRecordDraft>();
  const fieldPattern = /^paintRecords\.(\d+)\.(room|brand|finish|colour|notes)$/;

  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") {
      continue;
    }

    const match = key.match(fieldPattern);
    if (!match) {
      continue;
    }

    const index = Number.parseInt(match[1], 10);
    const field = match[2] as keyof PaintRecordDraft;
    const current = grouped.get(index) ?? { room: null, brand: null, finish: null, colour: null, notes: null };
    current[field] = optionalString(value);
    grouped.set(index, current);
  }

  return [...grouped.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, draft]) => draft);
}

export async function createPropertyAction(formData: FormData): Promise<void> {
  const addressLine = optionalString(formData.get("addressLine"));
  const city = optionalString(formData.get("city"));

  if (!addressLine) {
    redirect("/properties/new?error=Address%20line%20is%20required");
  }
  if (!city) {
    redirect("/properties/new?error=City%20is%20required");
  }

  const property = await prisma.property.create({
    data: {
      addressLine,
      city,
      postcode: optionalString(formData.get("postcode")),
      accessNotes: optionalString(formData.get("accessNotes")),
    },
  });

  revalidatePath("/properties");
  redirect(`/properties/${property.id}`);
}

export async function updateAccessNotesAction(formData: FormData): Promise<void> {
  const propertyId = requiredString(formData.get("propertyId"));
  const accessNotes = optionalString(formData.get("accessNotes"));

  await prisma.property.update({
    where: { id: propertyId },
    data: { accessNotes },
  });

  revalidatePath(`/properties/${propertyId}`);
}

export async function createJobAction(formData: FormData): Promise<void> {
  const propertyId = requiredString(formData.get("propertyId"));

  const job = await prisma.job.create({
    data: {
      propertyId,
      title: requiredString(formData.get("title")),
      description: optionalString(formData.get("description")),
      jobDate: parseDate(formData.get("jobDate")),
    },
  });

  revalidatePath(`/properties/${propertyId}`);
  redirect(`/jobs/${job.id}`);
}

export async function createJobWithPaintRecordsAction(formData: FormData): Promise<void> {
  const propertyId = optionalString(formData.get("propertyId"));

  if (!propertyId) {
    redirect("/properties?error=Missing%20property%20id");
  }

  const jobDateRaw = optionalString(formData.get("jobDate"));
  const summary = optionalString(formData.get("summary"));
  const notes = optionalString(formData.get("notes"));

  if (!jobDateRaw) {
    redirect(`/properties/${propertyId}/jobs/new?error=Job%20date%20is%20required`);
  }
  if (!summary) {
    redirect(`/properties/${propertyId}/jobs/new?error=Summary%20is%20required`);
  }

  const parsedJobDate = new Date(jobDateRaw);
  if (Number.isNaN(parsedJobDate.getTime())) {
    redirect(`/properties/${propertyId}/jobs/new?error=Job%20date%20is%20invalid`);
  }

  const paintDrafts = parsePaintRecordDrafts(formData);
  const paintCreates: Array<{
    area: string;
    brand: string | null;
    finish: string | null;
    colourName: string;
    notes: string | null;
  }> = [];

  for (let index = 0; index < paintDrafts.length; index += 1) {
    const draft = paintDrafts[index];
    const hasAnyField = [draft.room, draft.brand, draft.finish, draft.colour, draft.notes].some(Boolean);

    if (!hasAnyField) {
      continue;
    }

    if (!draft.room) {
      redirect(`/properties/${propertyId}/jobs/new?error=Paint%20record%20${index + 1}%20requires%20a%20room`);
    }
    if (!draft.colour) {
      redirect(`/properties/${propertyId}/jobs/new?error=Paint%20record%20${index + 1}%20requires%20a%20colour`);
    }

    paintCreates.push({
      area: draft.room,
      brand: draft.brand,
      finish: draft.finish,
      colourName: draft.colour,
      notes: draft.notes,
    });
  }

  await prisma.job.create({
    data: {
      propertyId,
      title: summary,
      description: notes,
      jobDate: parsedJobDate,
      ...(paintCreates.length > 0 ? { paintRecords: { create: paintCreates } } : {}),
    },
  });

  revalidatePath(`/properties/${propertyId}`);
  redirect(`/properties/${propertyId}`);
}

async function savePaintPhoto(file: File): Promise<string> {
  const extension = path.extname(file.name || "").toLowerCase() || ".jpg";
  const fileName = `${randomUUID()}${extension}`;
  const relativePath = path.posix.join("/uploads/paint-records", fileName);
  const uploadDirectory = path.join(process.cwd(), "public", "uploads", "paint-records");
  const absolutePath = path.join(uploadDirectory, fileName);

  await mkdir(uploadDirectory, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, bytes);

  return relativePath;
}

export async function createPaintRecordAction(formData: FormData): Promise<void> {
  const jobId = requiredString(formData.get("jobId"));
  const photo = formData.get("photo");
  let photoPath: string | null = null;

  if (photo instanceof File && photo.size > 0) {
    if (!photo.type.startsWith("image/")) {
      throw new Error("Photo must be an image.");
    }

    photoPath = await savePaintPhoto(photo);
  }

  await prisma.paintRecord.create({
    data: {
      jobId,
      area: requiredString(formData.get("area")),
      brand: optionalString(formData.get("brand")),
      productName: optionalString(formData.get("productName")),
      colourName: optionalString(formData.get("colourName")),
      colourCode: optionalString(formData.get("colourCode")),
      finish: optionalString(formData.get("finish")),
      notes: optionalString(formData.get("notes")),
      photoPath,
    },
  });

  revalidatePath(`/jobs/${jobId}`);
  redirect(`/jobs/${jobId}`);
}
