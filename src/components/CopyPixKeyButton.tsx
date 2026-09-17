"use client";

import { useState } from "react";

export function CopyPixKeyButton({ pixKey }: { pixKey: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-2 rounded-full border border-brand-blue px-4 py-1.5 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white"
    >
      {copied ? "Chave copiada!" : "Copiar chave PIX"}
    </button>
  );
}
