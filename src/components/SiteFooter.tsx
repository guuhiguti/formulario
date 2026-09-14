export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-brand-blue-dark text-blue-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <p className="text-base font-semibold text-white">Ser Solidário</p>
        <p className="mt-1 text-sm">Conectando pessoas. Transformando vidas.</p>
        <p className="mt-4 text-xs text-blue-200">
          © {year} Ser Solidário. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
