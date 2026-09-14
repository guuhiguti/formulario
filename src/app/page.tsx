import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <Image
        src="/logo.png"
        alt="Ser Solidário"
        width={120}
        height={120}
        className="mb-6 h-28 w-28 object-contain"
        priority
      />
      <h1 className="text-2xl font-semibold text-slate-900">Ser Solidário</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Em breve, o site completo do Ser Solidário. Por enquanto, você pode se inscrever como
        voluntário pelo link abaixo.
      </p>
      <Link
        href="/voluntariado"
        className="mt-6 inline-block rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Quero ser voluntário
      </Link>
    </main>
  );
}
