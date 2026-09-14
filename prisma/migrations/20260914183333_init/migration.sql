-- CreateEnum
CREATE TYPE "HowFoundOut" AS ENUM ('REDES_SOCIAIS', 'INDICACAO_VOLUNTARIO', 'INDICACAO_AMIGOS_FAMILIA', 'OUTRO');

-- CreateEnum
CREATE TYPE "InterestArea" AS ENUM ('MIDIAS_SOCIAIS_MARKETING', 'FOTOS_VIDEOS', 'RECREACAO_OFICINAS', 'CULINARIA_ALIMENTACAO', 'ORGANIZACAO_LOGISTICA');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('NOVO', 'CONTATADO', 'ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "howFoundOut" "HowFoundOut" NOT NULL,
    "referralName" TEXT,
    "otherSourceDetail" TEXT,
    "expectations" TEXT NOT NULL,
    "hasExperience" BOOLEAN NOT NULL,
    "experienceDetail" TEXT,
    "interestAreas" "InterestArea"[],
    "lgpdConsent" BOOLEAN NOT NULL DEFAULT false,
    "status" "VolunteerStatus" NOT NULL DEFAULT 'NOVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Volunteer_createdAt_idx" ON "Volunteer"("createdAt");
