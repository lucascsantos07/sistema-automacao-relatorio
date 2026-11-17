"use client";

import { IdCard, Instagram, Mail, MapPin, Pencil, Phone } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Avatar, BadgeStatus } from "@/components/ui/Badges";
import { formatarDocumento } from "@/lib/utils";
import type { Cliente } from "@/lib/types";

type Props = { cliente: Cliente; onClose: () => void; onEditar: () => void };

export default function ModalDetalhesCliente({ cliente: c, onClose, onEditar }: Props) {
  // Bloco de informação: ícone + rótulo + valor
  const Info = ({ Icone, rotulo, valor, largo }: { Icone: typeof Mail; rotulo: string; valor: string; largo?: boolean }) => (
    <div className={`flex items-center gap-3 rounded-xl border border-slate-200 p-4 ${largo ? "sm:col-span-2" : ""}`}>
      <Icone className="h-5 w-5 shrink-0 text-brand-500" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500">{rotulo}</p>
        <p className="break-words text-sm font-semibold">{valor}</p>
      </div>
    </div>
  );

  return (
    <Modal titulo="Dados do cliente" descricao="Informações cadastrais e de contato." onClose={onClose} largura="max-w-xl">
      <div className="mb-4 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
        <Avatar nome={c.nome} grande />
        <div className="flex-1">
          <p className="font-bold">{c.nome}</p>
          <p className="text-xs text-slate-500">{c.instagram}</p>
        </div>
        <BadgeStatus status={c.status} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Info Icone={IdCard} rotulo={c.tipo_pessoa === "PF" ? "CPF" : "CNPJ"} valor={formatarDocumento(c.documento, c.tipo_pessoa)} />
        <Info Icone={Mail} rotulo="E-mail" valor={c.email} />
        <Info Icone={Phone} rotulo="Telefone" valor={c.telefone} />
        <Info Icone={Instagram} rotulo="Instagram" valor={c.instagram} />
        <Info Icone={MapPin} rotulo="Endereço" valor={c.endereco} largo />
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">Fechar</button>
        <button onClick={onEditar} className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600">
          <Pencil className="h-4 w-4" /> Editar cliente
        </button>
      </div>
    </Modal>
  );
}
