"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eye, Pencil, Plus, Power, RotateCcw, Search } from "lucide-react";
import { Avatar, BadgeStatus, BadgeTipoDocumento } from "@/components/ui/Badges";
import { formatarDocumento, formatarInstagram } from "@/lib/utils";
import ModalNovoCliente from "./ModalNovoCliente";
import ModalDetalhesCliente from "./ModalDetalhesCliente";
import ModalEditarCliente from "./ModalEditarCliente";
import ModalStatusCliente from "./ModalStatusCliente";

export default function ClientesTable({ clientes, total, pagina, porPagina }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [modal, setModal] = useState(null);
  const [busca, setBusca] = useState(params.get("q") || "");

  function atualizarUrl(chave, valor) {
    const novo = new URLSearchParams(params.toString());
    if (valor) novo.set(chave, valor);
    else novo.delete(chave);
    if (chave !== "page") novo.delete("page");
    router.replace(`${pathname}?${novo.toString()}`);
  }

  useEffect(() => {
    if (busca === (params.get("q") || "")) return;
    const t = setTimeout(() => atualizarUrl("q", busca.trim()), 350);
    return () => clearTimeout(t);
  }, [busca]);

  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));

  return (
    <>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Clientes</h1>
          <p className="pagina-subtitulo">
            Consulte e gerencie os clientes e perfis monitorados da agência.
          </p>
        </div>
        <button
          onClick={() => setModal({ tipo: "novo" })}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Novo cliente</span>
        </button>
      </div>

      <div className="card-painel">
        {/* Barra de Filtros */}
        <div className="barra-filtros">
          <div className="busca-input-container">
            <Search size={18} className="busca-icone" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, @username, documento ou e-mail..."
              className="campo-input busca-input"
            />
          </div>

          <select
            className="campo-input select-filtro"
            value={params.get("tipo") || ""}
            onChange={(e) => atualizarUrl("tipo", e.target.value)}
            aria-label="Filtrar por tipo"
          >
            <option value="">Todos os tipos</option>
            <option value="PF">Pessoa física (CPF)</option>
            <option value="PJ">Pessoa jurídica (CNPJ)</option>
          </select>

          <select
            className="campo-input select-filtro"
            value={params.get("status") || ""}
            onChange={(e) => atualizarUrl("status", e.target.value)}
            aria-label="Filtrar por status"
          >
            <option value="">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>

        {/* Tabela de Clientes */}
        <div className="tabela-responsiva">
          <table className="tabela-clientes">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>CPF / CNPJ</th>
                <th>Instagram</th>
                <th>E-mail</th>
                <th>Contato</th>
                <th>Status</th>
                <th className="th-acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={8} className="tabela-celula-vazia">
                    Nenhum cliente encontrado. Ajuste os filtros ou cadastre um novo cliente.
                  </td>
                </tr>
              )}
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="cliente-celula-info">
                      <Avatar nome={c.nome} />
                      <span className="cliente-nome-texto">{c.nome}</span>
                    </div>
                  </td>
                  <td>
                    <BadgeTipoDocumento documento={c.cpf_cnpj} />
                  </td>
                  <td className="texto-secundario">
                    {formatarDocumento(c.cpf_cnpj)}
                  </td>
                  <td className="texto-destaque-rosa">
                    {formatarInstagram(c.username)}
                  </td>
                  <td className="texto-secundario">{c.email}</td>
                  <td className="texto-secundario">{c.telefone}</td>
                  <td>
                    <BadgeStatus ativo={c.ativo} />
                  </td>
                  <td>
                    <div className="acoes-grupo">
                      <button
                        className="btn-icone"
                        aria-label="Ver detalhes"
                        title="Ver detalhes"
                        onClick={() => setModal({ tipo: "detalhes", cliente: c })}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icone"
                        aria-label="Editar"
                        title="Editar"
                        onClick={() => setModal({ tipo: "editar", cliente: c })}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn-icone"
                        aria-label={c.ativo ? "Desativar" : "Reativar"}
                        title={c.ativo ? "Desativar" : "Reativar"}
                        onClick={() => setModal({ tipo: "status", cliente: c })}
                      >
                        {c.ativo ? <Power size={16} /> : <RotateCcw size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé da Tabela: Contagem e Paginação */}
        <div className="tabela-rodape">
          <span className="tabela-contagem-texto">
            Mostrando {clientes.length} de {total} clientes
          </span>
          <div className="paginacao-grupo">
            <button
              disabled={pagina <= 1}
              onClick={() => atualizarUrl("page", String(pagina - 1))}
              className="paginacao-btn"
            >
              Anterior
            </button>
            <span className="paginacao-pagina-atual">
              {pagina}/{totalPaginas}
            </span>
            <button
              disabled={pagina >= totalPaginas}
              onClick={() => atualizarUrl("page", String(pagina + 1))}
              className="paginacao-btn"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {modal?.tipo === "novo" && (
        <ModalNovoCliente onClose={() => setModal(null)} />
      )}
      {modal?.tipo === "detalhes" && (
        <ModalDetalhesCliente
          cliente={modal.cliente}
          onClose={() => setModal(null)}
          onEditar={() => setModal({ tipo: "editar", cliente: modal.cliente })}
        />
      )}
      {modal?.tipo === "editar" && (
        <ModalEditarCliente
          cliente={modal.cliente}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.tipo === "status" && (
        <ModalStatusCliente
          cliente={modal.cliente}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
