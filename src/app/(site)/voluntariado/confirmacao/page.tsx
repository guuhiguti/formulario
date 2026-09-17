import Link from "next/link";
import { CopyPixKeyButton } from "@/components/CopyPixKeyButton";

const PIX_KEY = "19 98153-0819";

export default function ConfirmacaoPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-brand-blue-light px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-7 w-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-brand-blue-dark">
          Inscrição enviada com sucesso!
        </h1>
        <div className="mb-8 rounded-xl border border-brand-blue/20 bg-brand-blue-light p-5 text-left">
          <p className="mb-3 text-sm text-slate-700">
            Realize a contribuição de <strong>R$ 53,00</strong> e envie o comprovante pelo
            WhatsApp, informando em quais eventos você irá participar.
          </p>
          <p className="text-sm text-slate-800">
            <strong>Chave PIX: {PIX_KEY}</strong>
            <br />
            Banco Inter | Fabiana Higuti
          </p>
          <CopyPixKeyButton pixKey={PIX_KEY} />
        </div>
        <Link
          href="/voluntariado"
          className="inline-block rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
        >
          Voltar para o formulário
        </Link>
      </div>
    </main>
  );
}
