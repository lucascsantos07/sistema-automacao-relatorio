"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eye, Pencil, Plus, Power, RotateCcw, Search } from "lucide-react";
import { Avatar, BadgeStatus } from "@/components/ui/Badges";
import { formatarDocumento } from "@/lib/utils";
import type { Cliente } from "@/lib/types";
import ModalNovoCliente from "./ModalNovoCliente";
import ModalDetalhesCliente from "./ModalDetalhesCliente";
import ModalEditarCliente from "./ModalEditarCliente";
import ModalStatusCliente from "./ModalStatusCliente";

type Props = { clientes: Cliente[]; total: number; pagina: number; porPagina: number };
// Qual modal está aberto (e para qual cliente)
type Modal = { tipo: "novo" } | { tipo: "detalhes" | "editar" | "status"; cliente: Cliente } | null;

export default function ClientesTable({ clientes, total, pagina, porPagina }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams(); // filtros vivem na URL: q, tipo, status, page
  const [modal, setModal] = useState<Modal>(null);
  const [busca, setBusca] = useState(params.get("q") ?? "");

  // Atualiza um parâmetro da URL (o Server Component refaz a consulta com o novo filtro)
  function atualizarUrl(chave: string, valor: string) {
    const novo = new URLSearchParams(params.toString());
    if (valor) novo.set(chave, valor); else novo.delete(chave);
    if (chave !== "page") novo.delete("page"); // mudou filtro: volta à página 1
    router.replace(`${pathname}?${novo.toString()}`);
  }

  // Debounce: só busca 350ms depois da última tecla
  useEffect(() => {
    if (busca === (params.get("q") ?? "")) return; // nada mudou
    const t = setTimeout(() => atualizarUrl("q", busca.trim()), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca]);

  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const btnIcone = "rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50";
  const selectCls = "rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm";

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Clientes</h1>
          <p className="mt-1 text-slate-500">Consulte e mantenha os dados dos clientes da agência.</p>
        </div>
        <button onClick={() => setModal({ tipo: "novo" })}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600">
          <Plus className="h-4 w-4" /> Novo cliente
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {/* Barra de busca e filtros */}
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-5">
          <div className="relative min-w-60 flex-1">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, @, documento ou e-mail..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-3 text-sm" />
          </div>
          <select className={selectCls} value={params.get("tipo") ?? ""} onChange={(e) => atualizarUrl("tipo", e.target.value)} aria-label="Filtrar por tipo">
            <option value="">Todos os tipos</option><option value="PF">Pessoa física</option><option value="PJ">Pessoa jurídica</option>
          </select>
          <select className={selectCls} value={params.get("status") ?? ""} onChange={(e) => atualizarUrl("status", e.target.value)} aria-label="Filtrar por status">
            <option value="">Todos os status</option><option value="ativo">Ativos</option><option value="inativo">Inativos</option>
          </select>
        </div>

        {/* overflow-x-auto: a tabela rola de lado em telas pequenas */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500">
              <tr>{["Cliente", "Tipo", "CPF / CNPJ", "Instagram", "E-mail", "Contato", "Status", "Ações"].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr>
            </thead>
            <tbody>
              {clientes.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-500">Nenhum cliente encontrado. Ajuste os filtros ou cadastre um novo cliente.</td></tr>
              )}
              {clientes.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar nome={c.nome} /><span className="font-semibold">{c.nome}</span></div></td>
                  <td className="px-5 py-4"><span className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${c.tipo_pessoa === "PF" ? "bg-purple-50 text-purple-700" : "bg-sky-50 text-sky-700"}`}>{c.tipo_pessoa === "PF" ? "CPF" : "CNPJ"}</span></td>
                  <td className="px-5 py-4 text-slate-600">{formatarDocumento(c.documento, c.tipo_pessoa)}</td>
                  <td className="px-5 py-4 text-brand-600">{c.instagram}</td>
                  <td className="px-5 py-4 text-slate-600">{c.email}</td>
                  <td className="px-5 py-4 text-slate-600">{c.telefone}</td>
                  <td className="px-5 py-4"><BadgeStatus status={c.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className={btnIcone} aria-label="Ver detalhes" onClick={() => setModal({ tipo: "detalhes", cliente: c })}><Eye className="h-4 w-4" /></button>
                      <button className={btnIcone} aria-label="Editar" onClick={() => setModal({ tipo: "editar", cliente: c })}><Pencil className="h-4 w-4" /></button>
                      <button className={btnIcone} aria-label={c.status === "ativo" ? "Desativar" : "Reativar"} title={c.status === "ativo" ? "Desativar" : "Reativar"}
                        onClick={() => setModal({ tipo: "status", cliente: c })}>
                        {c.status === "ativo" ? <Power className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé: contagem e paginação */}
        <div className="flex items-center justify-between border-t border-slate-100 p-5 text-xs text-slate-500">
          <span>Mostrando {clientes.length} de {total} clientes</span>
          <div className="flex items-center gap-2">
            <button disabled={pagina <= 1} onClick={() => atualizarUrl("page", String(pagina - 1))} className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40">Anterior</button>
            <span className="rounded-lg bg-plum-700 px-3 py-2 font-bold text-white">{pagina}/{totalPaginas}</span>
            <button disabled={pagina >= totalPaginas} onClick={() => atualizarUrl("page", String(pagina + 1))} className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40">Próxima</button>
          </div>
        </div>
      </div>

      {/* Renderiza apenas o modal ativo */}
      {modal?.tipo === "novo" && <ModalNovoCliente onClose={() => setModal(null)} />}
      {modal?.tipo === "detalhes" && <ModalDetalhesCliente cliente={modal.cliente} onClose={() => setModal(null)} onEditar={() => setModal({ tipo: "editar", cliente: modal.cliente })} />}
      {modal?.tipo === "editar" && <ModalEditarCliente cliente={modal.cliente} onClose={() => setModal(null)} />}
      {modal?.tipo === "status" && <ModalStatusCliente cliente={modal.cliente} onClose={() => setModal(null)} />}
    </>
  );
}
