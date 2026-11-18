import { iniciais } from "@/lib/utils";

// Selo verde "Ativo" / cinza "Inativo" baseado no booleano 'ativo' (ou string status)
export function BadgeStatus({ ativo }) {
  const estaAtivo = ativo === true || ativo === "ativo";
  return (
    <span className={`badge-status ${estaAtivo ? "status-ativo" : "status-inativo"}`}>
      <span className="badge-status-dot" />
      <span>{estaAtivo ? "Ativo" : "Inativo"}</span>
    </span>
  );
}

// Círculo com as iniciais do nome
export function Avatar({ nome, grande = false }) {
  return (
    <span className={`avatar-circle ${grande ? "avatar-grande" : ""}`}>
      {iniciais(nome)}
    </span>
  );
}

// Badge de PF (CPF) ou PJ (CNPJ) deduzido pelo tamanho do documento
export function BadgeTipoDocumento({ documento }) {
  const limpo = String(documento || "").replace(/\D/g, "");
  const ehPF = limpo.length <= 11;
  return (
    <span className={`badge-tipo ${ehPF ? "tipo-pf" : "tipo-pj"}`}>
      {ehPF ? "CPF" : "CNPJ"}
    </span>
  );
}
