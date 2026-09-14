import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { HOW_FOUND_OUT_OPTIONS, INTEREST_AREA_OPTIONS } from "@/lib/validation";

function labelFor(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.split("=")[1];

  const isValid = await verifyAdminSessionToken(token);
  if (!isValid) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Ser Solidário";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Voluntários", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheet.columns = [
    { header: "Data de inscrição", key: "createdAt", width: 18 },
    { header: "Nome completo", key: "fullName", width: 26 },
    { header: "Idade", key: "age", width: 8 },
    { header: "Data de nascimento", key: "birthDate", width: 16 },
    { header: "Bairro", key: "neighborhood", width: 20 },
    { header: "WhatsApp", key: "whatsapp", width: 16 },
    { header: "E-mail", key: "email", width: 26 },
    { header: "Instagram", key: "instagram", width: 18 },
    { header: "Como conheceu", key: "howFoundOut", width: 22 },
    { header: "Detalhe (indicação/outro)", key: "sourceDetail", width: 26 },
    { header: "Áreas de interesse", key: "interestAreas", width: 40 },
    { header: "Já teve experiência?", key: "hasExperience", width: 16 },
    { header: "Detalhe da experiência", key: "experienceDetail", width: 32 },
    { header: "O que espera aprender/vivenciar", key: "expectations", width: 40 },
    { header: "Status", key: "status", width: 14 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0B4F9E" },
  };
  headerRow.alignment = { vertical: "middle", wrapText: true };
  headerRow.height = 22;
  sheet.autoFilter = { from: "A1", to: "O1" };

  for (const volunteer of volunteers) {
    sheet.addRow({
      createdAt: volunteer.createdAt,
      fullName: volunteer.fullName,
      age: volunteer.age,
      birthDate: volunteer.birthDate,
      neighborhood: volunteer.neighborhood,
      whatsapp: volunteer.whatsapp,
      email: volunteer.email,
      instagram: volunteer.instagram,
      howFoundOut: labelFor(HOW_FOUND_OUT_OPTIONS, volunteer.howFoundOut),
      sourceDetail: volunteer.referralName ?? volunteer.otherSourceDetail ?? "",
      interestAreas: volunteer.interestAreas
        .map((area) => labelFor(INTEREST_AREA_OPTIONS, area))
        .join(", "),
      hasExperience: volunteer.hasExperience ? "Sim" : "Não",
      experienceDetail: volunteer.experienceDetail ?? "",
      expectations: volunteer.expectations,
      status: volunteer.status,
    });
  }

  sheet.getColumn("createdAt").numFmt = "dd/mm/yyyy hh:mm";
  sheet.getColumn("birthDate").numFmt = "dd/mm/yyyy";

  for (let i = 2; i <= sheet.rowCount; i++) {
    sheet.getRow(i).alignment = { vertical: "top", wrapText: true };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `voluntarios-ser-solidario-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
