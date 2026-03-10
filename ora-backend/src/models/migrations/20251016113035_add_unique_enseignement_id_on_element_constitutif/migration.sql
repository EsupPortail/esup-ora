DELETE FROM "element_constitutif"
WHERE id NOT IN (
    SELECT MIN(id)
    FROM "element_constitutif"
    GROUP BY "enseignement_id"
);
CREATE UNIQUE INDEX IF NOT EXISTS "element_constitutif_enseignement_id_key" 
ON "element_constitutif"("enseignement_id");