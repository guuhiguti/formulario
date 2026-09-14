import { prisma } from "@/lib/prisma";
import { HOW_FOUND_OUT_OPTIONS, INTEREST_AREA_OPTIONS } from "@/lib/validation";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { ExportPdfButton } from "@/components/ExportPdfButton";

export const dynamic = "force-dynamic";

function labelFor(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export default async function AdminPage() {
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between print:mb-4">
          <div>
            <h1 className="text-xl font-semibold text-brand-blue-dark">
              Inscrições de voluntários — Ser Solidário
            </h1>
            <p className="text-sm text-slate-500">
              {volunteers.length} inscrição{volunteers.length === 1 ? "" : "s"} recebida
              {volunteers.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <a
              href="/api/admin/export"
              className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-blue-dark"
            >
              Exportar Excel
            </a>
            <ExportPdfButton />
            <AdminLogoutButton />
          </div>
        </div>

        {volunteers.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Nenhuma inscrição recebida ainda.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white print:overflow-visible print:rounded-none print:border-0">
            <table className="min-w-full divide-y divide-slate-200 text-sm print:text-[9px]">
              <thead className="bg-brand-blue-light text-left text-xs font-semibold uppercase tracking-wide text-brand-blue-dark print:table-header-group print:bg-white">
                <tr>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">Data</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">Nome</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">Idade</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">Bairro</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">WhatsApp</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">E-mail</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">Instagram</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">Como conheceu</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">Áreas de interesse</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">Experiência prévia</th>
                  <th className="px-4 py-3 print:px-1.5 print:py-1">
                    O que espera aprender/vivenciar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="align-top print:break-inside-avoid">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500 print:px-1.5 print:py-1">
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(volunteer.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 print:px-1.5 print:py-1">
                      {volunteer.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-700 print:px-1.5 print:py-1">
                      {volunteer.age}
                    </td>
                    <td className="px-4 py-3 text-slate-700 print:px-1.5 print:py-1">
                      {volunteer.neighborhood}
                    </td>
                    <td className="px-4 py-3 text-slate-700 print:px-1.5 print:py-1">
                      {volunteer.whatsapp}
                    </td>
                    <td className="px-4 py-3 text-slate-700 print:px-1.5 print:py-1">
                      {volunteer.email}
                    </td>
                    <td className="px-4 py-3 text-slate-700 print:px-1.5 print:py-1">
                      {volunteer.instagram}
                    </td>
                    <td className="px-4 py-3 text-slate-700 print:px-1.5 print:py-1">
                      {labelFor(HOW_FOUND_OUT_OPTIONS, volunteer.howFoundOut)}
                      {volunteer.referralName && (
                        <div className="text-xs text-slate-500">
                          Indicado por: {volunteer.referralName}
                        </div>
                      )}
                      {volunteer.otherSourceDetail && (
                        <div className="text-xs text-slate-500">
                          {volunteer.otherSourceDetail}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700 print:px-1.5 print:py-1">
                      <ul className="list-disc pl-4 print:pl-3">
                        {volunteer.interestAreas.map((area) => (
                          <li key={area}>{labelFor(INTEREST_AREA_OPTIONS, area)}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-slate-700 print:px-1.5 print:py-1">
                      {volunteer.hasExperience ? "Sim" : "Não"}
                      {volunteer.experienceDetail && (
                        <div className="text-xs text-slate-500">
                          {volunteer.experienceDetail}
                        </div>
                      )}
                    </td>
                    <td className="min-w-[220px] px-4 py-3 text-slate-700 print:min-w-0 print:px-1.5 print:py-1">
                      {volunteer.expectations}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
