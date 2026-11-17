"use client";

import { useState, useTransition } from "react";
import { Building2, User } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Campo, MensagemErro, RodapeBotoes, inputCls } from "@/components/ui/Campo";
import { criarCliente } from "@/actions/cliente-actions";
import { mascararCNPJ, mascararCPF, mascararTelefone } from "@/lib/utils";
import type { TipoPessoa } from "@/lib/types";

export default function ModalNovoCliente({ onClose }: { onClose: () => void }) {
  const [tipo, setTipo] = useState<TipoPessoa>("PF"); // seletor PF/PJ
  // Estado único do formulário (um objeto em vez de 6 useState)
  const [f, setF] = useState({ nome: "", documento: "", email: "", telefone: "", instagram: "", endereco: "" });
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  const pf = tipo === "PF"; // atalho: só rótulos e máscara mudam entre PF e PJ
  const set = (campo: keyof typeof f, valor: string) => setF((a) => ({ ...a, [campo]: valor })); // atualiza um campo

  // Ao trocar o tipo, limpa o documento (a máscara é diferente)
  function trocarTipo(t: TipoPessoa) {
    setTipo(t);
    set("documento", "");
  }

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      const r = await criarCliente({ tipo_pessoa: tipo, ...f }); // Server Action
      if (r.ok) onClose();
      else setErro(r.erro);
    });
  }

  // Cartão de escolha de tipo (botão grande com ícone)
  const Opcao = ({ valor, rotulo, sigla, Icone }: { valor: TipoPessoa; rotulo: string; sigla: string; Icone: typeof User }) => (
    <button type="button" onClick={() => trocarTipo(valor)} aria-pressed={tipo === valor}
      className={`flex items-center justify-between rounded-xl border px-4 py-5 text-sm font-semibold ${
        tipo === valor ? "border-brand-500 bg-brand-50 text-brand-600" : "border-slate-200 hover:bg-slate-50"
      }`}>
      <span className="flex items-center gap-3"><Icone className="h-5 w-5" />{rotulo}</span>
      <span className="text-[10px] text-slate-500">{sigla}</span>
    </button>
  );

  return (
    <Modal titulo="Novo cliente" descricao="Preencha os dados para adicionar um cliente." onClose={onClose}>
      <form onSubmit={submeter} className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold">Tipo de cliente</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Opcao valor="PF" rotulo="Pessoa física" sigla="CPF" Icone={User} />
            <Opcao valor="PJ" rotulo="Pessoa jurídica" sigla="CNPJ" Icone={Building2} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Campo label={pf ? "Nome completo" : "Razão social"} obrigatorio>
            <input required className={inputCls} value={f.nome} onChange={(e) => set("nome", e.target.value)}
              placeholder={pf ? "Digite o nome completo" : "Digite a razão social"} />
          </Campo>
          <Campo label={pf ? "CPF" : "CNPJ"} obrigatorio>
            <input required className={inputCls} inputMode="numeric" value={f.documento}
              onChange={(e) => set("documento", pf ? mascararCPF(e.target.value) : mascararCNPJ(e.target.value))}
              placeholder={pf ? "000.000.000-00" : "00.000.000/0000-00"} />
          </Campo>
          <Campo label="E-mail" obrigatorio>
            <input required type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="contato@cliente.com" />
          </Campo>
          <Campo label="Telefone" obrigatorio>
            <input required className={inputCls} inputMode="tel" value={f.telefone}
              onChange={(e) => set("telefone", mascararTelefone(e.target.value))} placeholder="(00) 00000-0000" />
          </Campo>
          <Campo label="Usuário do Instagram" obrigatorio>
            <input required className={inputCls} value={f.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@nomedoperfil" />
          </Campo>
        </div>
        <Campo label="Endereço completo" obrigatorio>
          <input required className={inputCls} value={f.endereco} onChange={(e) => set("endereco", e.target.value)} placeholder="Rua, número, bairro, cidade e estado" />
        </Campo>

        <MensagemErro texto={erro} />
        <RodapeBotoes onCancelar={onClose} carregando={pendente} textoPrincipal="Cadastrar cliente" />
      </form>
    </Modal>
  );
}
