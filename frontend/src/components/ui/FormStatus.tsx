"use client";

import { useState, useTransition } from "react";
import { Lock, Power, RotateCcw } from "lucide-react";
import { Campo, MensagemErro, RodapeBotoes, inputCls } from "./Campo";
import type { ActionResult } from "@/lib/types";

type Props = {
  nome: string; // nome do registro afetado
  ativo: boolean; // true = será desativado; false = será reativado
  entidade: string; // "cliente" ou "funcionário" (só para os textos)
  enviar: (justificativa: string, senha: string) => Promise<ActionResult>; // Server Action
  onClose: () => void;
};

// Formulário comum de desativar/reativar: justificativa + senha. Usado por clientes e funcionários.
export default function FormStatus({ nome, ativo, entidade, enviar, onClose }: Props) {
  const [justificativa, setJustificativa] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  const verbo = ativo ? "desativar" : "reativar"; // texto conforme o estado atual
  const Icone = ativo ? Power : RotateCcw;

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      const r = await enviar(justificativa, senha); // senha errada volta como erro, sem alterar nada
      if (r.ok) onClose(); // sucesso: fecha (a página recarrega via revalidatePath)
      else setErro(r.erro);
    });
  }

  return (
    <form onSubmit={submeter} className="space-y-5">
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${ativo ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
          <Icone className="h-6 w-6" />
        </div>
        <div>
          <p className="font-bold">Você vai {verbo} {nome}</p>
          <p className="text-xs text-slate-500">
            {ativo ? `O ${entidade} deixa de aparecer como ativo, mas o histórico é mantido.` : `O ${entidade} volta a ficar ativo.`}
          </p>
        </div>
      </div>

      <p className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900">
        Para sua segurança, informe o motivo e confirme com sua senha de acesso.
      </p>

      <Campo label={`Justificativa para ${verbo}`} obrigatorio>
        <textarea required rows={4} value={justificativa} onChange={(e) => setJustificativa(e.target.value)}
          placeholder={`Descreva por que este ${entidade} será ${ativo ? "desativado" : "reativado"}...`}
          className={inputCls} />
      </Campo>

      <Campo label="Senha de confirmação" obrigatorio>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha" autoComplete="current-password" className={`${inputCls} pl-11`} />
        </div>
      </Campo>

      <MensagemErro texto={erro} />
      <RodapeBotoes onCancelar={onClose} carregando={pendente} perigo={ativo}
        textoPrincipal={ativo ? "Confirmar desativação" : "Confirmar reativação"} />
    </form>
  );
}
