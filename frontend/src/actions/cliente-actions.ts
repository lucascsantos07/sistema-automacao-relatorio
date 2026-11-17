"use server";

import { revalidatePath } from "next/cache";
import {
  apenasDigitos,
  cnpjValido,
  cpfValido,
  emailValido,
  instagramValido,
  normalizarInstagram,
} from "@/lib/utils";
import { apiCriarCliente, apiEditarCliente, apiAlterarStatusCliente } from "@/lib/api";
import type { ActionResult, TipoPessoa } from "@/lib/types";

// Campos editáveis pelo formulário
type CamposEditaveis = {
  nome: string;
  email: string;
  telefone: string;
  instagram: string;
  endereco: string;
};

// Cadastro = campos editáveis + tipo e documento
type DadosCliente = CamposEditaveis & {
  tipo_pessoa: TipoPessoa;
  documento: string;
};

// Validação dos campos comuns no lado do servidor
function validarCampos(d: CamposEditaveis): string | null {
  if (!d.nome.trim()) return "Informe o nome ou a razão social.";
  if (!emailValido(d.email)) return "Informe um e-mail válido.";
  if (apenasDigitos(d.telefone).length < 10) return "Informe um telefone válido com DDD.";
  if (!instagramValido(normalizarInstagram(d.instagram))) return "Informe um usuário de Instagram válido.";
  if (!d.endereco.trim()) return "Informe o endereço completo.";
  return null;
}

export async function criarCliente(dados: DadosCliente): Promise<ActionResult> {
  if (dados.tipo_pessoa !== "PF" && dados.tipo_pessoa !== "PJ") {
    return { ok: false, erro: "Tipo de pessoa inválido." };
  }

  const documento = apenasDigitos(dados.documento);
  if (dados.tipo_pessoa === "PF" && !cpfValido(documento)) {
    return { ok: false, erro: "CPF inválido." };
  }
  if (dados.tipo_pessoa === "PJ" && !cnpjValido(documento)) {
    return { ok: false, erro: "CNPJ inválido." };
  }

  const erroValidacao = validarCampos(dados);
  if (erroValidacao) return { ok: false, erro: erroValidacao };

  const resultado = await apiCriarCliente({
    tipo_pessoa: dados.tipo_pessoa,
    nome: dados.nome.trim(),
    documento,
    email: dados.email.trim().toLowerCase(),
    telefone: dados.telefone,
    instagram: normalizarInstagram(dados.instagram),
    endereco: dados.endereco.trim(),
  });

  if (!resultado.ok) {
    return { ok: false, erro: resultado.erro };
  }

  revalidatePath("/clientes");
  return { ok: true };
}

export async function editarCliente(id: string, dados: CamposEditaveis): Promise<ActionResult> {
  const { nome, email, telefone, instagram, endereco } = dados;
  const erroValidacao = validarCampos({ nome, email, telefone, instagram, endereco });
  if (erroValidacao) return { ok: false, erro: erroValidacao };

  const resultado = await apiEditarCliente(id, {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    telefone,
    instagram: normalizarInstagram(instagram),
    endereco: endereco.trim(),
  });

  if (!resultado.ok) {
    return { ok: false, erro: resultado.erro };
  }

  revalidatePath("/clientes");
  return { ok: true };
}

export async function alterarStatusCliente(
  id: string,
  justificativa: string,
  senha: string
): Promise<ActionResult> {
  if (!justificativa.trim()) return { ok: false, erro: "Informe a justificativa." };

  const resultado = await apiAlterarStatusCliente(id, {
    status: "inativo", // O backend pode alternar baseado no estado atual
    justificativa: justificativa.trim(),
    senha,
  });

  if (!resultado.ok) {
    return { ok: false, erro: resultado.erro };
  }

  revalidatePath("/clientes");
  return { ok: true };
}
