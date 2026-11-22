import { z } from "zod";

export const EngineStatusSchema = z.enum([
  "complete", "partial", "unverified", "not_implemented", "invalid_input", "error"
]);
export type EngineStatus = z.infer<typeof EngineStatusSchema>;

export const ProvenanceSchema = z.object({
  sourceId: z.string().min(1),
  title: z.string().min(1),
  edition: z.string().optional(),
  url: z.string().url().optional(),
  license: z.string().optional(),
  retrievedAt: z.string().datetime().optional(),
  checksum: z.string().optional()
});
export type Provenance = z.infer<typeof ProvenanceSchema>;

export const EngineMetadataSchema = z.object({
  engineId: z.string().min(1),
  engineVersion: z.string().min(1),
  rulesetId: z.string().min(1),
  rulesetVersion: z.string().min(1),
  status: EngineStatusSchema
});
export type EngineMetadata = z.infer<typeof EngineMetadataSchema>;

export interface EngineResult<T> extends EngineMetadata {
  inputDigest: string;
  result?: T;
  warnings: string[];
  provenance: Provenance[];
  calculatedAt: string;
}

export const BirthInputSchema = z.object({
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  localTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/).optional(),
  timeZone: z.string().min(1),
  calendar: z.enum(["gregorian", "chinese_lunisolar"]),
  leapMonth: z.boolean().optional(),
  timePrecision: z.enum(["minute", "hour", "date_only", "unknown"]),
  confidence: z.enum(["exact", "approximate", "unknown"]),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  trueSolarTimePolicy: z.enum(["disabled", "optional", "required"]).default("disabled")
}).superRefine((value, ctx) => {
  if (value.calendar === "chinese_lunisolar" && value.leapMonth === undefined) {
    ctx.addIssue({ code: "custom", path: ["leapMonth"], message: "leapMonth must be explicit for Chinese lunisolar input" });
  }
  if (value.timePrecision === "date_only" || value.timePrecision === "unknown") {
    if (value.localTime !== undefined) {
      ctx.addIssue({ code: "custom", path: ["localTime"], message: "Do not provide localTime for date_only or unknown precision" });
    }
  } else if (value.localTime === undefined) {
    ctx.addIssue({ code: "custom", path: ["localTime"], message: "localTime is required for minute/hour precision" });
  }
});
export type BirthInput = z.infer<typeof BirthInputSchema>;

export const IChingSessionRequestSchema = z.object({
  method: z.enum(["three_coins", "yarrow_stalks"]),
  question: z.string().trim().min(1).max(500).optional(),
  initiatedByUser: z.literal(true)
});
export type IChingSessionRequest = z.infer<typeof IChingSessionRequestSchema>;
