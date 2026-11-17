"use client";

import { useState, useTransition } from "react";
import { Lock } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Campo, MensagemErro, RodapeBotoes, inputCls } from "@/components/ui/Campo";
import { editarCliente } from "@/actions/cliente-actions";
import { formatarDocumento, mascararTelefone } from "@/lib/utils";
import type { Cliente } from "@/lib/types";

export default function ModalEditarCliente({ cliente: c, onClose }: { cliente: Cliente; onClose: () => void }) {
  // Começa com os valores atuais do cliente
  const [f, setF] = useState({ nome: c.nome, email: c.email, telefone: c.telefone, instagram: c.instagram, endereco: c.endereco });
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();
  const pf = c.tipo_pessoa === "PF";
  const set = (campo: keyof typeof f, valor: string) => setF((a) => ({ ...a, [campo]: valor }));

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      const r = await editarCliente(c.id, f); // só envia campos editáveis; tipo/documento nem saem do navegador
      if (r.ok) onClose();
      else setErro(r.erro);
    });
  }

  return (
    <Modal titulo="Editar cliente" descricao="Atualize as informações permitidas deste cadastro." onClose={onClose}>
      <form onSubmit={submeter} className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Lock className="h-5 w-5 text-amber-700" />
          <div>
            <p className="text-xs font-bold">Informações protegidas</p>
            <p className="text-[11px] text-amber-900">O {pf ? "CPF" : "CNPJ"} e o tipo de cliente não podem ser alterados.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Campo label={pf ? "Nome completo" : "Razão social"} obrigatorio>
            <input required className={inputCls} value={f.nome} onChange={(e) => set("nome", e.target.value)} />
          </Campo>
          <Campo label={pf ? "CPF" : "CNPJ"} obrigatorio dica="Este campo não pode ser alterado">
            {/* disabled: o navegador não permite editar nem envia o valor */}
            <input disabled className={inputCls} value={formatarDocumento(c.documento, c.tipo_pessoa)} />
          </Campo>
          <Campo label="E-mail" obrigatorio>
            <input required type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} />
          </Campo>
          <Campo label="Telefone" obrigatorio>
            <input required className={inputCls} value={f.telefone} onChange={(e) => set("telefone", mascararTelefone(e.target.value))} />
          </Campo>
          <Campo label="Usuário do Instagram" obrigatorio>
            <input required className={inputCls} value={f.instagram} onChange={(e) => set("instagram", e.target.value)} />
          </Campo>
          <Campo label="Tipo de pessoa" dica="Este campo não pode ser alterado">
            <input disabled className={inputCls} value={pf ? "Pessoa física" : "Pessoa jurídica"} />
          </Campo>
        </div>
        <Campo label="Endereço completo" obrigatorio>
          <input required className={inputCls} value={f.endereco} onChange={(e) => set("endereco", e.target.value)} />
        </Campo>

        <MensagemErro texto={erro} />
        <RodapeBotoes onCancelar={onClose} carregando={pendente} textoPrincipal="Salvar alterações" />
      </form>
    </Modal>
  );
}
