import type { Cliente, ListarClientesResponse } from "@/lib/types";
import { getClientesMock } from "@/lib/mock-data";
import { apenasDigitos } from "@/lib/utils";

// URL base do backend REST externo (lida das variáveis de ambiente)
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");

export type FiltrosListagem = {
  q?: string;
  tipo?: string;
  status?: string;
  pagina?: number;
  porPagina?: number;
};

/**
 * Filtra e pagina os dados estáticos em memória caso o backend externo não esteja rodando.
 */
function filtrarDadosEstaticos(filtros: FiltrosListagem): ListarClientesResponse {
  let lista = [...getClientesMock()];

  if (filtros.tipo === "PF" || filtros.tipo === "PJ") {
    lista = lista.filter((c) => c.tipo_pessoa === filtros.tipo);
  }

  if (filtros.status === "ativo" || filtros.status === "inativo") {
    lista = lista.filter((c) => c.status === filtros.status);
  }

  if (filtros.q) {
    const termo = filtros.q.toLowerCase().trim();
    const digitos = apenasDigitos(termo);
    lista = lista.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.instagram.toLowerCase().includes(termo) ||
        (digitos && c.documento.includes(digitos))
    );
  }

  const total = lista.length;
  const porPagina = filtros.porPagina || 10;
  const pagina = Math.max(1, filtros.pagina || 1);
  const inicio = (pagina - 1) * porPagina;
  const clientesPaginados = lista.slice(inicio, inicio + porPagina);

  return {
    clientes: clientesPaginados,
    total,
  };
}

/**
 * Busca a lista de clientes. Se a API REST estiver ativa, consome dela;
 * caso contrário, usa os dados estáticos para permitir testes visuais completos.
 */
export async function listarClientes(filtros: FiltrosListagem = {}): Promise<ListarClientesResponse> {
  const params = new URLSearchParams();
  if (filtros.q) params.set("q", filtros.q);
  if (filtros.tipo) params.set("tipo", filtros.tipo);
  if (filtros.status) params.set("status", filtros.status);
  if (filtros.pagina) params.set("page", String(filtros.pagina));
  if (filtros.porPagina) params.set("limit", String(filtros.porPagina));

  const url = `${API_URL}/clientes${params.toString() ? `?${params.toString()}` : ""}`;

  try {
    // Tenta conectar à API externa com timeout curto para não travar a tela se o backend estiver desligado
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return { clientes: data as Cliente[], total: data.length };
      }
      if (data && Array.isArray(data.clientes)) {
        return {
          clientes: data.clientes as Cliente[],
          total: typeof data.total === "number" ? data.total : data.clientes.length,
        };
      }
    }
  } catch {
    // Backend offline ou inacessível: fallback transparente para os dados estáticos
  }

  return filtrarDadosEstaticos(filtros);
}

/**
 * Cadastra um cliente. Se a API externa estiver offline, salva nos dados estáticos em memória.
 */
export async function apiCriarCliente(dados: Omit<Cliente, "id" | "status" | "created_at">) {
  try {
    const res = await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: true as const, data: body };
    }
  } catch {
    // Fallback: insere na lista estática em memória
    const lista = getClientesMock();
    const novo: Cliente = {
      id: "c" + (lista.length + 1) + "_" + Date.now(),
      ...dados,
      status: "ativo",
      created_at: new Date().toISOString(),
    };
    lista.unshift(novo);
    return { ok: true as const, data: novo };
  }

  return { ok: true as const };
}

/**
 * Edita um cliente. Se a API externa estiver offline, atualiza na lista estática em memória.
 */
export async function apiEditarCliente(
  id: string,
  dados: { nome: string; email: string; telefone: string; instagram: string; endereco: string }
) {
  try {
    const res = await fetch(`${API_URL}/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (res.ok) {
      return { ok: true as const };
    }
  } catch {
    // Fallback: edita na lista estática em memória
    const lista = getClientesMock();
    const index = lista.findIndex((c) => c.id === id);
    if (index !== -1) {
      lista[index] = { ...lista[index], ...dados };
      return { ok: true as const };
    }
  }

  // Se a lista em memória foi atualizada ou se foi sucesso
  const lista = getClientesMock();
  const index = lista.findIndex((c) => c.id === id);
  if (index !== -1) {
    lista[index] = { ...lista[index], ...dados };
  }
  return { ok: true as const };
}

/**
 * Altera status do cliente (ativo/inativo). Se a API externa estiver offline, alterna na lista estática.
 */
export async function apiAlterarStatusCliente(
  id: string,
  dados: { status?: "ativo" | "inativo"; justificativa?: string; senha?: string }
) {
  try {
    const res = await fetch(`${API_URL}/clientes/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (res.ok) {
      return { ok: true as const };
    }
  } catch {
    // Fallback: alterna status na lista estática em memória
  }

  const lista = getClientesMock();
  const alvo = lista.find((c) => c.id === id);
  if (alvo) {
    alvo.status = alvo.status === "ativo" ? "inativo" : "ativo";
  }

  return { ok: true as const };
}
