import Link from "next/link";

export default function ConfirmacaoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-slate-900">
          Inscrição enviada com sucesso!
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Obrigado por se inscrever como voluntário do Ser Solidário. Em breve nossa equipe vai
          entrar em contato pelo WhatsApp ou e-mail informado.
        </p>
        <Link
          href="/voluntariado"
          className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Voltar para o formulário
        </Link>
      </div>
    </main>
  );
}
