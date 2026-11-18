// Utilitários gerais do sistema

// Extrai as iniciais do nome para exibição em avatares
export function iniciais(nome) {
  if (!nome || typeof nome !== "string") return "?";
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}
