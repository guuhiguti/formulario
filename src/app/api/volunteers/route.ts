import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { volunteerFormSchema } from "@/lib/validation";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitBuckets.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitBuckets.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  rateLimitBuckets.set(ip, timestamps);
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde um minuto e tente novamente." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot: campo invisível que só bots preenchem.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = volunteerFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const volunteer = await prisma.volunteer.create({
      data: {
        fullName: data.fullName,
        age: data.age,
        birthDate: new Date(data.birthDate),
        neighborhood: data.neighborhood,
        whatsapp: data.whatsapp,
        email: data.email,
        instagram: data.instagram,
        howFoundOut: data.howFoundOut,
        referralName: data.referralName?.trim() || null,
        otherSourceDetail: data.otherSourceDetail?.trim() || null,
        expectations: data.expectations,
        hasExperience: data.hasExperience,
        experienceDetail: data.experienceDetail?.trim() || null,
        interestAreas: data.interestAreas,
        lgpdConsent: data.lgpdConsent,
      },
    });

    return NextResponse.json({ ok: true, id: volunteer.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "DUPLICATE_EMAIL" }, { status: 409 });
    }
    throw error;
  }
}
