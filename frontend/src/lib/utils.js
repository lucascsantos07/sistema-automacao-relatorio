// Utilitários de formatação, máscaras e validações

// Remove caracteres não numéricos
export const apenasDigitos = (v) => (v ? String(v).replace(/\D/g, "") : "");

// Máscara dinâmica de CPF: 000.000.000-00
export function mascararCPF(v) {
  return apenasDigitos(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// Máscara dinâmica de CNPJ: 00.000.000/0000-00
export function mascararCNPJ(v) {
  return apenasDigitos(v)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

// Máscara de Telefone: (00) 00000-0000 ou (00) 0000-0000
export function mascararTelefone(v) {
  const d = apenasDigitos(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Formata o documento salvo (sem máscara) conforme o tamanho (11 = CPF, 14 = CNPJ)
export function formatarDocumento(doc) {
  const limpo = apenasDigitos(doc);
  if (limpo.length <= 11) return mascararCPF(limpo);
  return mascararCNPJ(limpo);
}

// O banco armazena o username do Instagram sem o '@'
export const normalizarUsername = (v) => (v ? String(v).trim().replace(/^@+/, "") : "");

// Exibe o username com o '@' na interface
export const formatarInstagram = (u) => (u ? `@${normalizarUsername(u)}` : "");

// Iniciais para o avatar
export function iniciais(nome) {
  if (!nome || typeof nome !== "string") return "?";
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

// Validação de CPF pelos dígitos verificadores
export function cpfValido(valor) {
  const c = apenasDigitos(valor);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const dv = (base, pesoInicial) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (pesoInicial - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return dv(c.slice(0, 9), 10) === Number(c[9]) && dv(c.slice(0, 10), 11) === Number(c[10]);
}

// Validação de CNPJ pelos dígitos verificadores
export function cnpjValido(valor) {
  const c = apenasDigitos(valor);
  if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false;
  const dv = (base) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split("").reduce((acc, n, i) => acc + Number(n) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return dv(c.slice(0, 12)) === Number(c[12]) && dv(c.slice(0, 13)) === Number(c[13]);
}

export const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
export const usernameValido = (v) => /^[A-Za-z0-9._]{1,30}$/.test(normalizarUsername(v));
