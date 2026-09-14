import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-brand-blue-light px-4 py-16 text-center">
      <Image
        src="/icon-ser-solidario.jpg"
        alt="Ser Solidário"
        width={112}
        height={112}
        className="mb-6 h-28 w-28 rounded-2xl shadow-md"
        priority
      />
      <h1 className="text-3xl font-bold text-brand-blue-dark sm:text-4xl">Ser Solidário</h1>
      <p className="mt-4 max-w-md text-base text-slate-600 sm:text-lg">
        Em breve, o site completo do Ser Solidário. Por enquanto, você já pode se inscrever
        como voluntário pelo botão abaixo.
      </p>
      <Link
        href="/voluntariado"
        className="mt-8 inline-block rounded-full bg-brand-blue px-8 py-3 text-base font-semibold text-white shadow-md transition hover:bg-brand-blue-dark"
      >
        Quero ser voluntário
      </Link>
    </main>
  );
}
