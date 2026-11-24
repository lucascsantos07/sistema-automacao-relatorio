"use client";

import { useState, useTransition } from "react";
import { Lock } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Campo, MensagemErro, RodapeBotoes } from "@/components/ui/Campo";
import { editarCliente } from "@/actions/cliente-actions";
import { formatarDocumento, mascararTelefone } from "@/lib/utils";

export default function ModalEditarCliente({ cliente: c, onClose }) {
  const [f, setF] = useState({
    nome: c.nome || "",
    email: c.email || "",
    telefone: c.telefone || "",
    username: c.username || "",
    endereco: c.endereco || "",
  });
  const [erro, setErro] = useState(null);
  const [pendente, startTransition] = useTransition();

  const ehPF = String(c.cpf_cnpj || "").replace(/\D/g, "").length <= 11;
  const set = (campo, valor) => setF((a) => ({ ...a, [campo]: valor }));

  function submeter(e) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      const r = await editarCliente(c.id, f);
      if (r && r.ok) {
        onClose();
      } else {
        setErro(r?.erro || "Ocorreu um erro ao salvar as alterações.");
      }
    });
  }

  return (
    <Modal
      titulo="Editar cliente"
      descricao="Atualize as informações permitidas deste cadastro."
      onClose={onClose}
      largura="modal-grande"
    >
      <form onSubmit={submeter}>
        <div className="alerta-protegido-box">
          <Lock size={20} className="alerta-protegido-icone" />
          <div>
            <p className="alerta-protegido-titulo">Informação protegida</p>
            <p className="alerta-protegido-sub">
              O documento ({ehPF ? "CPF" : "CNPJ"}) é único e não pode ser alterado após o cadastro.
            </p>
          </div>
        </div>

        <div className="form-grid-2">
          <Campo label={ehPF ? "Nome completo" : "Razão social"} obrigatorio>
            <input
              required
              className="campo-input"
              value={f.nome}
              onChange={(e) => set("nome", e.target.value)}
            />
          </Campo>

          <Campo label={ehPF ? "CPF" : "CNPJ"} dica="Campo protegido pelo banco de dados">
            <input
              disabled
              className="campo-input"
              value={formatarDocumento(c.cpf_cnpj)}
            />
          </Campo>

          <Campo label="E-mail" obrigatorio>
            <input
              required
              type="email"
              className="campo-input"
              value={f.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Campo>

          <Campo label="Telefone" obrigatorio>
            <input
              required
              className="campo-input"
              value={f.telefone}
              onChange={(e) => set("telefone", mascararTelefone(e.target.value))}
            />
          </Campo>

          <Campo label="Usuário do Instagram (@)" obrigatorio>
            <input
              required
              className="campo-input"
              value={f.username}
              onChange={(e) => set("username", e.target.value)}
            />
          </Campo>

          <Campo label="Tipo de cliente" dica="Deduzido pelo tamanho do CPF/CNPJ">
            <input
              disabled
              className="campo-input"
              value={ehPF ? "Pessoa física" : "Pessoa jurídica"}
            />
          </Campo>
        </div>

        <Campo label="Endereço completo" obrigatorio>
          <input
            required
            className="campo-input"
            value={f.endereco}
            onChange={(e) => set("endereco", e.target.value)}
          />
        </Campo>

        <MensagemErro texto={erro} />
        <RodapeBotoes
          onCancelar={onClose}
          carregando={pendente}
          textoPrincipal="Salvar alterações"
        />
      </form>
    </Modal>
  );
}
