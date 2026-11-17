import { iniciais } from "@/lib/utils";

// Selo verde "Ativo" / cinza "Inativo"
export function BadgeStatus({ status }: { status: "ativo" | "inativo" }) {
  const ativo = status === "ativo";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${ativo ? "text-emerald-700" : "text-slate-500"}`}>
      <span className={`h-2 w-2 rounded-full ${ativo ? "bg-emerald-500" : "bg-slate-400"}`} />
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}

// Círculo rosa claro com as iniciais do nome
export function Avatar({ nome, grande }: { nome: string; grande?: boolean }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-brand-50 font-bold text-brand-600 ${grande ? "h-12 w-12 text-base" : "h-10 w-10 text-xs"}`}>
      {iniciais(nome)}
    </span>
  );
}
