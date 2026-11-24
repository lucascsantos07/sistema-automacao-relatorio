"use server";

import { revalidatePath } from "next/cache";
import {
  apenasDigitos,
  cnpjValido,
  cpfValido,
  emailValido,
  usernameValido,
} from "@/lib/utils";
import {
  apiCriarCliente,
  apiEditarCliente,
  apiAlterarStatusCliente,
} from "@/lib/api";

function validarCamposComuns(d) {
  if (!d.nome || !d.nome.trim()) return "Informe o nome ou a razão social.";
  if (!emailValido(d.email)) return "Informe um e-mail válido.";
  if (apenasDigitos(d.telefone).length < 10) return "Informe um telefone válido com DDD.";
  if (!usernameValido(d.username)) return "Informe um usuário de Instagram válido (sem espaços ou caracteres especiais).";
  if (!d.endereco || !d.endereco.trim()) return "Informe o endereço completo.";
  return null;
}

export async function criarCliente(dados) {
  const doc = apenasDigitos(dados.cpf_cnpj);
  const ehPF = doc.length <= 11;

  if (ehPF && !cpfValido(doc)) return { ok: false, erro: "CPF inválido." };
  if (!ehPF && !cnpjValido(doc)) return { ok: false, erro: "CNPJ inválido." };

  const erroValidacao = validarCamposComuns(dados);
  if (erroValidacao) return { ok: false, erro: erroValidacao };

  const resultado = await apiCriarCliente(dados);
  if (!resultado.ok) return { ok: false, erro: resultado.erro };

  revalidatePath("/clientes");
  return { ok: true };
}

export async function editarCliente(id, dados) {
  const erroValidacao = validarCamposComuns(dados);
  if (erroValidacao) return { ok: false, erro: erroValidacao };

  const resultado = await apiEditarCliente(id, dados);
  if (!resultado.ok) return { ok: false, erro: resultado.erro };

  revalidatePath("/clientes");
  return { ok: true };
}

export async function alterarStatusCliente(id, statusAtual, justificativa, senha) {
  if (!justificativa || !justificativa.trim()) {
    return { ok: false, erro: "Informe a justificativa." };
  }

  const novoAtivo = !statusAtual;
  const resultado = await apiAlterarStatusCliente(id, {
    ativo: novoAtivo,
    justificativa: justificativa.trim(),
    senha,
  });

  if (!resultado.ok) return { ok: false, erro: resultado.erro };

  revalidatePath("/clientes");
  return { ok: true };
}
