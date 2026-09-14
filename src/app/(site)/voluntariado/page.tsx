import { VolunteerForm } from "@/components/VolunteerForm";

export default function VoluntariadoPage() {
  return (
    <main className="flex-1 bg-brand-blue-light px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-bold text-brand-blue-dark sm:text-4xl">
            Formulário de Inscrição
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Preencha o formulário abaixo para se inscrever no voluntariado do Ser Solidário.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-10">
          <VolunteerForm />
        </div>
      </div>
    </main>
  );
}
