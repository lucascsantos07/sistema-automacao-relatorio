"use client";

import Modal from "@/components/ui/Modal";
import FormStatus from "@/components/ui/FormStatus";
import { alterarStatusCliente } from "@/actions/cliente-actions";

export default function ModalStatusCliente({ cliente: c, onClose }) {
  const ativo = c.ativo === true;

  return (
    <Modal
      titulo={ativo ? "Desativar cliente" : "Reativar cliente"}
      descricao="Confirme os dados para registrar a alteração de status."
      onClose={onClose}
      largura="modal-pequeno"
    >
      <FormStatus
        nome={c.nome}
        ativo={ativo}
        entidade="cliente"
        onClose={onClose}
        enviar={(justificativa, senha) =>
          alterarStatusCliente(c.id, ativo, justificativa, senha)
        }
      />
    </Modal>
  );
}
