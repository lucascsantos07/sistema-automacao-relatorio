import { getClientesMock } from "@/lib/mock-data";
import { apenasDigitos, normalizarUsername } from "@/lib/utils";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");

/**
 * Filtra e pagina os dados estáticos em memória caso o backend não esteja ativo.
 */
function filtrarDadosEstaticos(filtros = {}) {
  let lista = [...getClientesMock()];

  if (filtros.tipo === "PF") {
    lista = lista.filter((c) => apenasDigitos(c.cpf_cnpj).length <= 11);
  } else if (filtros.tipo === "PJ") {
    lista = lista.filter((c) => apenasDigitos(c.cpf_cnpj).length > 11);
  }

  if (filtros.status === "ativo") {
    lista = lista.filter((c) => c.ativo === true);
  } else if (filtros.status === "inativo") {
    lista = lista.filter((c) => c.ativo === false);
  }

  if (filtros.q) {
    const termo = filtros.q.toLowerCase().trim();
    const digitos = apenasDigitos(termo);
    lista = lista.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.username.toLowerCase().includes(termo) ||
        (digitos && apenasDigitos(c.cpf_cnpj).includes(digitos))
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
 * caso contrário, usa os dados estáticos de teste.
 */
export async function listarClientes(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.q) params.set("q", filtros.q);
  if (filtros.tipo) params.set("tipo", filtros.tipo);
  if (filtros.status) params.set("status", filtros.status);
  if (filtros.pagina) params.set("page", String(filtros.pagina));
  if (filtros.porPagina) params.set("limit", String(filtros.porPagina));

  const url = `${API_URL}/clientes${params.toString() ? `?${params.toString()}` : ""}`;

  try {
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
        return { clientes: data, total: data.length };
      }
      if (data && Array.isArray(data.clientes)) {
        return {
          clientes: data.clientes,
          total: typeof data.total === "number" ? data.total : data.clientes.length,
        };
      }
    }
  } catch {
    // Backend offline: fallback transparente para os dados estáticos
  }

  return filtrarDadosEstaticos(filtros);
}

/**
 * Cadastra um cliente.
 */
export async function apiCriarCliente(dados) {
  const payload = {
    nome: dados.nome.trim(),
    email: dados.email.trim().toLowerCase(),
    cpf_cnpj: apenasDigitos(dados.cpf_cnpj),
    username: normalizarUsername(dados.username),
    telefone: dados.telefone,
    endereco: dados.endereco.trim(),
    ativo: true,
  };

  try {
    const res = await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: true, data: body };
    }
    const erroBody = await res.json().catch(() => null);
    return { ok: false, erro: erroBody?.erro || "Erro ao cadastrar cliente na API." };
  } catch {
    // Fallback: insere na lista em memória
    const lista = getClientesMock();
    const novo = {
      id: lista.length + 1,
      ...payload,
      justificativa_exclusao: null,
      justificativa_ativacao: null,
    };
    lista.unshift(novo);
    return { ok: true, data: novo };
  }
}

/**
 * Atualiza os dados permitidos do cliente.
 */
export async function apiEditarCliente(id, dados) {
  const payload = {
    nome: dados.nome.trim(),
    email: dados.email.trim().toLowerCase(),
    username: normalizarUsername(dados.username),
    telefone: dados.telefone,
    endereco: dados.endereco.trim(),
  };

  try {
    const res = await fetch(`${API_URL}/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { ok: true };
    }
    const erroBody = await res.json().catch(() => null);
    return { ok: false, erro: erroBody?.erro || "Erro ao editar cliente na API." };
  } catch {
    // Fallback: edita na lista em memória
    const lista = getClientesMock();
    const index = lista.findIndex((c) => String(c.id) === String(id));
    if (index !== -1) {
      lista[index] = { ...lista[index], ...payload };
    }
    return { ok: true };
  }
}

/**
 * Altera o status (ativo/inativo) do cliente com justificativa de auditoria.
 */
export async function apiAlterarStatusCliente(id, dados) {
  const payload = {
    ativo: dados.ativo,
    justificativa_exclusao: dados.ativo ? null : dados.justificativa,
    justificativa_ativacao: dados.ativo ? dados.justificativa : null,
    senha: dados.senha,
  };

  try {
    let res = await fetch(`${API_URL}/clientes/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 404) {
      res = await fetch(`${API_URL}/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (res.ok) {
      return { ok: true };
    }
  } catch {
    // Fallback: altera na lista em memória
  }

  const lista = getClientesMock();
  const index = lista.findIndex((c) => String(c.id) === String(id));
  if (index !== -1) {
    const cliente = lista[index];
    const novoStatus = !cliente.ativo;
    lista[index] = {
      ...cliente,
      ativo: novoStatus,
      justificativa_exclusao: novoStatus ? null : dados.justificativa,
      justificativa_ativacao: novoStatus ? dados.justificativa : null,
    };
  }

  return { ok: true };
}
