// Utilitários: máscaras, validações e formatação. Usados no cliente (máscaras) e no servidor (validação).

// Remove tudo que não é número: "123.456" -> "123456"
export const apenasDigitos = (v: string) => v.replace(/\D/g, "");

// Máscara de CPF: 000.000.000-00 (aplicada enquanto a pessoa digita)
export function mascararCPF(v: string) {
  return apenasDigitos(v)
    .slice(0, 11) // CPF tem no máximo 11 dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // após 3 dígitos, coloca o primeiro ponto
    .replace(/(\d{3})(\d)/, "$1.$2") // após mais 3, o segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // os 2 últimos dígitos vão depois do hífen
}

// Máscara de CNPJ: 00.000.000/0000-00
export function mascararCNPJ(v: string) {
  return apenasDigitos(v)
    .slice(0, 14) // CNPJ tem no máximo 14 dígitos
    .replace(/^(\d{2})(\d)/, "$1.$2") // 00.
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // 00.000.
    .replace(/\.(\d{3})(\d)/, ".$1/$2") // 00.000.000/
    .replace(/(\d{4})(\d)/, "$1-$2"); // 0000-
}

// Máscara de telefone: (00) 00000-0000 (celular) ou (00) 0000-0000 (fixo)
export function mascararTelefone(v: string) {
  const d = apenasDigitos(v).slice(0, 11); // DDD + até 9 dígitos
  if (d.length <= 2) return d; // só DDD digitado ainda
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`; // "(84) 9918"
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`; // fixo 4+4
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`; // celular 5+4
}

// Formata documento salvo (só dígitos) conforme o tipo
export const formatarDocumento = (doc: string, tipo: "PF" | "PJ") =>
  tipo === "PF" ? mascararCPF(doc) : mascararCNPJ(doc);

// Garante o "@" no início do Instagram e remove espaços: "  usuario" -> "@usuario"
export const normalizarInstagram = (v: string) => "@" + v.trim().replace(/^@+/, "");

// Iniciais para o avatar: "Rafael Medeiros" -> "RM"
export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean); // separa por espaços
  if (partes.length === 0) return "?";
  const primeira = partes[0][0]; // inicial do primeiro nome
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ""; // inicial do último nome
  return (primeira + ultima).toUpperCase();
}

// Valida CPF pelos dois dígitos verificadores
export function cpfValido(valor: string) {
  const c = apenasDigitos(valor);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false; // tamanho errado ou todos dígitos iguais
  const dv = (base: string, pesoInicial: number) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (pesoInicial - i); // soma ponderada
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return dv(c.slice(0, 9), 10) === Number(c[9]) && dv(c.slice(0, 10), 11) === Number(c[10]);
}

// Valida CNPJ pelos dois dígitos verificadores
export function cnpjValido(valor: string) {
  const c = apenasDigitos(valor);
  if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false;
  const dv = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split("").reduce((acc, n, i) => acc + Number(n) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return dv(c.slice(0, 12)) === Number(c[12]) && dv(c.slice(0, 13)) === Number(c[13]);
}

export const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const instagramValido = (v: string) => /^@[A-Za-z0-9._]{1,30}$/.test(v);
