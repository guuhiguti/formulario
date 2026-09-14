import Link from "next/link";

export default function JaInscritoPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-brand-blue-light px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.008M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.28 2.25h17.8A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
            />
          </svg>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-brand-blue-dark">
          Você já se inscreveu!
        </h1>
        <p className="mb-8 text-base text-slate-600">
          Já recebemos uma inscrição com este e-mail. Nossa equipe já tem seus dados e vai
          entrar em contato em breve. Se precisar atualizar alguma informação, fale
          diretamente com o Ser Solidário.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
