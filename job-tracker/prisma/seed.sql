-- Demo seed data for Job Tracker CRM
-- Resets and inserts a small sample dataset:
-- - 2 properties
-- - 4 jobs (2 per property)
-- - 8 paint records (at least 2 rooms per property)

BEGIN;

DELETE FROM "PaintRecord"
WHERE "jobId" IN (
  '11000000-0000-0000-0000-000000000001',
  '11000000-0000-0000-0000-000000000002',
  '11000000-0000-0000-0000-000000000003',
  '11000000-0000-0000-0000-000000000004'
);

DELETE FROM "Job"
WHERE "id" IN (
  '11000000-0000-0000-0000-000000000001',
  '11000000-0000-0000-0000-000000000002',
  '11000000-0000-0000-0000-000000000003',
  '11000000-0000-0000-0000-000000000004'
);

DELETE FROM "Property"
WHERE "id" IN (
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002'
);

INSERT INTO "Property" ("id", "addressLine", "city", "postcode", "accessNotes", "createdAt", "updatedAt")
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '14 Oakview Terrace',
    'Leeds',
    'LS10 2AB',
    'Keys in lockbox by side gate. Code: 4201.',
    NOW(),
    NOW()
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '82 Willow Close',
    'Bradford',
    'BD7 4QP',
    'Call tenant before arrival. Visitor parking at rear lot.',
    NOW(),
    NOW()
  );

INSERT INTO "Job" ("id", "propertyId", "title", "description", "jobDate", "createdAt", "updatedAt")
VALUES
  (
    '11000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Hallway repaint and touch-ups',
    'Walls and skirting refreshed after tenancy change.',
    '2025-11-03T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '11000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Kitchen repaint',
    'Ceiling stain block then full top coat.',
    '2026-01-18T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '11000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    'Bedroom refresh',
    'One wall had minor cracks filled first.',
    '2025-10-22T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '11000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    'Living room full repaint',
    'Two-coat finish for better coverage.',
    '2026-02-05T00:00:00Z',
    NOW(),
    NOW()
  );

INSERT INTO "PaintRecord" (
  "id",
  "jobId",
  "area",
  "brand",
  "finish",
  "colourName",
  "notes",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    '12000000-0000-0000-0000-000000000001',
    '11000000-0000-0000-0000-000000000001',
    'Hallway',
    'Dulux Trade',
    'Vinyl Matt',
    'Jasmine White',
    'Existing colour match close enough.',
    NOW(),
    NOW()
  ),
  (
    '12000000-0000-0000-0000-000000000002',
    '11000000-0000-0000-0000-000000000001',
    'Stairs',
    'Johnstone''s',
    'Eggshell',
    'Soft Stone',
    'Extra coat near handrail section.',
    NOW(),
    NOW()
  ),
  (
    '12000000-0000-0000-0000-000000000003',
    '11000000-0000-0000-0000-000000000002',
    'Kitchen Walls',
    'Crown',
    'Kitchen Matt',
    'Cotton White',
    'Used moisture-resistant finish.',
    NOW(),
    NOW()
  ),
  (
    '12000000-0000-0000-0000-000000000004',
    '11000000-0000-0000-0000-000000000002',
    'Kitchen Ceiling',
    'Dulux',
    'Matt',
    'Pure Brilliant White',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '12000000-0000-0000-0000-000000000005',
    '11000000-0000-0000-0000-000000000003',
    'Bedroom 1',
    'Leyland',
    'Matt',
    'Magnolia',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '12000000-0000-0000-0000-000000000006',
    '11000000-0000-0000-0000-000000000003',
    'Bedroom 2',
    'Leyland',
    'Matt',
    'Ivory',
    'Minor stain block first.',
    NOW(),
    NOW()
  ),
  (
    '12000000-0000-0000-0000-000000000007',
    '11000000-0000-0000-0000-000000000004',
    'Living Room Walls',
    'Dulux Trade',
    'Durable Matt',
    'Pebble Shore',
    NULL,
    NOW(),
    NOW()
  ),
  (
    '12000000-0000-0000-0000-000000000008',
    '11000000-0000-0000-0000-000000000004',
    'Living Room Ceiling',
    'Armstead',
    'Contract Matt',
    'Brilliant White',
    NULL,
    NOW(),
    NOW()
  );

COMMIT;
