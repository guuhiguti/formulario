export function maskWhatsapp(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskInstagram(rawValue: string): string {
  const cleaned = rawValue.replace(/[^a-zA-Z0-9._@]/g, "");
  const withoutAt = cleaned.replace(/@/g, "");
  return `@${withoutAt.slice(0, 30)}`;
}
