import Fastify from "fastify";
import { BirthInputSchema, IChingSessionRequestSchema } from "@hybrid-fortune/domain";
import { normalizeBirthProfile } from "@hybrid-fortune/calendar";
import { calculateBazi } from "@hybrid-fortune/engine-bazi";
import { createIChingSession } from "@hybrid-fortune/engine-iching";
import { queryAlmanac } from "@hybrid-fortune/engine-almanac";

const app = Fastify({ logger: true });

app.get("/health", async () => ({
  status: "ok",
  service: "hybrid-fortune-api",
  version: "0.1.0"
}));

app.get("/v1/engines", async () => ({
  engines: [
    { id: "bazi", status: "not_implemented" },
    { id: "ziwei", status: "not_implemented" },
    { id: "iching", status: "separate_user_initiated_flow" },
    { id: "almanac", status: "not_implemented" },
    { id: "western-astrology", status: "not_implemented" }
  ]
}));

app.post("/v1/birth-profiles/normalize", async (request, reply) => {
  const result = normalizeBirthProfile(request.body);
  if (!result.success) {
    return reply.code(400).send({ error: "INVALID_BIRTH_INPUT", issues: result.issues });
  }
  return reply.code(200).send(result.profile);
});

app.post("/v1/calculations/bazi", async (request, reply) => {
  const parsed = BirthInputSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ error: "INVALID_BIRTH_INPUT", issues: parsed.error.issues });
  }
  const result = calculateBazi(parsed.data);
  return reply.code(501).send(result);
});

app.post("/v1/divinations/iching", async (request, reply) => {
  const parsed = IChingSessionRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ error: "INVALID_ICHING_REQUEST", issues: parsed.error.issues });
  }
  return reply.code(501).send(createIChingSession(parsed.data));
});

app.post("/v1/calculations/almanac", async (request, reply) => {
  const body = request.body as { localDate?: unknown; region?: unknown; editionId?: unknown };
  if (typeof body?.localDate !== "string" || typeof body.region !== "string" || typeof body.editionId !== "string") {
    return reply.code(400).send({ error: "INVALID_ALMANAC_REQUEST" });
  }
  return reply.code(501).send(queryAlmanac({
    localDate: body.localDate, region: body.region, editionId: body.editionId
  }));
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";
app.listen({ port, host }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
