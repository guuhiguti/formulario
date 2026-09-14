"use client";

export function ExportPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-blue-dark"
    >
      Exportar PDF
    </button>
  );
}
