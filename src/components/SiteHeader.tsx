import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-brand-blue-dark shadow-sm">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/icon-ser-solidario.jpg"
            alt="Ser Solidário"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl sm:h-10 sm:w-10"
            priority
          />
          <span className="text-base font-bold tracking-tight text-white sm:text-lg">
            Ser Solidário
          </span>
        </Link>
        <Link
          href="/voluntariado"
          className="rounded-full bg-brand-yellow px-3 py-1.5 text-xs font-semibold text-brand-blue-dark transition hover:bg-brand-yellow-dark sm:px-4 sm:py-2 sm:text-sm"
        >
          Quero ser voluntário
        </Link>
      </div>
    </header>
  );
}
