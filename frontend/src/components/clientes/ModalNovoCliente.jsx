"use client";

import { useState, useTransition } from "react";
import { Building2, User } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Campo, MensagemErro, RodapeBotoes } from "@/components/ui/Campo";
import { criarCliente } from "@/actions/cliente-actions";
import { mascararCNPJ, mascararCPF, mascararTelefone } from "@/lib/utils";

export default function ModalNovoCliente({ onClose }) {
  const [tipo, setTipo] = useState("PF");
  const [f, setF] = useState({
    nome: "",
    cpf_cnpj: "",
    email: "",
    telefone: "",
    username: "",
    endereco: "",
  });
  const [erro, setErro] = useState(null);
  const [pendente, startTransition] = useTransition();

  const pf = tipo === "PF";
  const set = (campo, valor) => setF((a) => ({ ...a, [campo]: valor }));

  function trocarTipo(t) {
    setTipo(t);
    set("cpf_cnpj", "");
  }

  function submeter(e) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      const r = await criarCliente(f);
      if (r && r.ok) {
        onClose();
      } else {
        setErro(r?.erro || "Ocorreu um erro ao cadastrar o cliente.");
      }
    });
  }

  return (
    <Modal
      titulo="Novo cliente"
      descricao="Preencha os dados cadastrais para adicionar o cliente da agência."
      onClose={onClose}
      largura="modal-grande"
    >
      <form onSubmit={submeter}>
        <div className="seletor-tipo-container">
          <p className="campo-label">Tipo de cliente</p>
          <div className="seletor-tipo-grid">
            <button
              type="button"
              onClick={() => trocarTipo("PF")}
              className={`seletor-tipo-card ${pf ? "ativo" : ""}`}
            >
              <div className="seletor-card-esquerda">
                <User size={20} />
                <span>Pessoa física</span>
              </div>
              <span className="seletor-card-sigla">CPF</span>
            </button>
            <button
              type="button"
              onClick={() => trocarTipo("PJ")}
              className={`seletor-tipo-card ${!pf ? "ativo" : ""}`}
            >
              <div className="seletor-card-esquerda">
                <Building2 size={20} />
                <span>Pessoa jurídica</span>
              </div>
              <span className="seletor-card-sigla">CNPJ</span>
            </button>
          </div>
        </div>

        <div className="form-grid-2">
          <Campo label={pf ? "Nome completo" : "Razão social"} obrigatorio>
            <input
              required
              className="campo-input"
              value={f.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder={pf ? "Digite o nome completo" : "Digite a razão social"}
            />
          </Campo>

          <Campo label={pf ? "CPF" : "CNPJ"} obrigatorio>
            <input
              required
              className="campo-input"
              inputMode="numeric"
              value={f.cpf_cnpj}
              onChange={(e) =>
                set("cpf_cnpj", pf ? mascararCPF(e.target.value) : mascararCNPJ(e.target.value))
              }
              placeholder={pf ? "000.000.000-00" : "00.000.000/0000-00"}
            />
          </Campo>

          <Campo label="E-mail" obrigatorio>
            <input
              required
              type="email"
              className="campo-input"
              value={f.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="contato@cliente.com"
            />
          </Campo>

          <Campo label="Telefone" obrigatorio>
            <input
              required
              className="campo-input"
              inputMode="tel"
              value={f.telefone}
              onChange={(e) => set("telefone", mascararTelefone(e.target.value))}
              placeholder="(00) 00000-0000"
            />
          </Campo>

          <Campo label="Usuário do Instagram (@)" obrigatorio dica="Armazenado no banco sem o símbolo @">
            <input
              required
              className="campo-input"
              value={f.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="@nomedoperfil"
            />
          </Campo>
        </div>

        <Campo label="Endereço completo" obrigatorio>
          <input
            required
            className="campo-input"
            value={f.endereco}
            onChange={(e) => set("endereco", e.target.value)}
            placeholder="Rua, número, bairro, cidade e estado"
          />
        </Campo>

        <MensagemErro texto={erro} />
        <RodapeBotoes
          onCancelar={onClose}
          carregando={pendente}
          textoPrincipal="Cadastrar cliente"
        />
      </form>
    </Modal>
  );
}
