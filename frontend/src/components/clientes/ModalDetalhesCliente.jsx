"use client";

import { IdCard, Instagram, Mail, MapPin, Pencil, Phone, AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Avatar, BadgeStatus, BadgeTipoDocumento } from "@/components/ui/Badges";
import { formatarDocumento, formatarInstagram } from "@/lib/utils";

export default function ModalDetalhesCliente({ cliente: c, onClose, onEditar }) {
  const ehPF = String(c.cpf_cnpj || "").replace(/\D/g, "").length <= 11;

  function InfoBloco({ Icone, rotulo, valor, largo = false }) {
    return (
      <div className={`detalhes-bloco-card ${largo ? "bloco-largo" : ""}`}>
        <Icone size={20} className="detalhes-icone" />
        <div className="detalhes-texto-box">
          <p className="detalhes-rotulo">{rotulo}</p>
          <p className="detalhes-valor">{valor || "Não informado"}</p>
        </div>
      </div>
    );
  }

  return (
    <Modal
      titulo="Dados do cliente"
      descricao="Informações cadastrais e dados de contato."
      onClose={onClose}
      largura="modal-mediano"
    >
      <div className="detalhes-header-card">
        <Avatar nome={c.nome} grande />
        <div className="detalhes-header-info">
          <p className="detalhes-header-nome">{c.nome}</p>
          <p className="detalhes-header-user">{formatarInstagram(c.username)}</p>
        </div>
        <BadgeStatus ativo={c.ativo} />
      </div>

      <div className="detalhes-grid">
        <InfoBloco
          Icone={IdCard}
          rotulo={ehPF ? "CPF (Pessoa física)" : "CNPJ (Pessoa jurídica)"}
          valor={formatarDocumento(c.cpf_cnpj)}
        />
        <InfoBloco Icone={Mail} rotulo="E-mail" valor={c.email} />
        <InfoBloco Icone={Phone} rotulo="Telefone" valor={c.telefone} />
        <InfoBloco Icone={Instagram} rotulo="Instagram" valor={formatarInstagram(c.username)} />
        <InfoBloco Icone={MapPin} rotulo="Endereço completo" valor={c.endereco} largo />
      </div>

      {c.ativo === false && c.justificativa_exclusao && (
        <div className="detalhes-justificativa-card">
          <AlertCircle size={20} className="detalhes-justificativa-icone" />
          <div>
            <p className="detalhes-justificativa-titulo">Motivo da inativação:</p>
            <p className="detalhes-justificativa-texto">{c.justificativa_exclusao}</p>
          </div>
        </div>
      )}

      <div className="detalhes-rodape-acoes">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Fechar
        </button>
        <button
          type="button"
          onClick={onEditar}
          className="btn btn-primary"
        >
          <Pencil size={16} />
          <span>Editar cliente</span>
        </button>
      </div>
    </Modal>
  );
}
