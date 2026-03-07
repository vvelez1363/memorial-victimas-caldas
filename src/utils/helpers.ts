export function createTrackingCode(prefix = "MEM"): string {
  const randomChunk = Math.random().toString(36).slice(2, 9).toUpperCase();
  return `${prefix}-${Date.now()}-${randomChunk}`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
