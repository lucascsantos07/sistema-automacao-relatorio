"use client";

import Modal from "@/components/ui/Modal";
import FormStatus from "@/components/ui/FormStatus";
import { alterarStatusCliente } from "@/actions/cliente-actions";
import type { Cliente } from "@/lib/types";

// Modal de desativar/reativar cliente: só liga o formulário comum à Server Action correta.
export default function ModalStatusCliente({ cliente: c, onClose }: { cliente: Cliente; onClose: () => void }) {
  const ativo = c.status === "ativo";
  return (
    <Modal titulo={ativo ? "Desativar cliente" : "Reativar cliente"} descricao="Confirme os dados para concluir esta ação." onClose={onClose} largura="max-w-xl">
      <FormStatus nome={c.nome} ativo={ativo} entidade="cliente" onClose={onClose}
        enviar={(justificativa, senha) => alterarStatusCliente(c.id, justificativa, senha)} />
    </Modal>
  );
}
