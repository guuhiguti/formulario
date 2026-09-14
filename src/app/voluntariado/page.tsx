import Image from "next/image";
import { VolunteerForm } from "@/components/VolunteerForm";

export default function VoluntariadoPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Ser Solidário"
            width={96}
            height={96}
            className="mb-4 h-24 w-24 object-contain"
            priority
          />
          <h1 className="text-2xl font-semibold text-slate-900">
            Formulário de Inscrição de Voluntário
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Preencha o formulário abaixo para se inscrever como voluntário do Ser Solidário.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <VolunteerForm />
        </div>
      </div>
    </main>
  );
}
