"use client";

import { useState, useTransition } from "react";
import { Lock, Power, RotateCcw } from "lucide-react";
import { Campo, MensagemErro, RodapeBotoes } from "./Campo";

export default function FormStatus({
  nome,
  ativo,
  entidade = "cliente",
  enviar,
  onClose,
}) {
  const [justificativa, setJustificativa] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [pendente, startTransition] = useTransition();

  const verbo = ativo ? "desativar" : "reativar";
  const Icone = ativo ? Power : RotateCcw;

  function submeter(e) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      const r = await enviar(justificativa, senha);
      if (r && r.ok) {
        onClose();
      } else {
        setErro(r?.erro || "Ocorreu um erro ao processar a ação.");
      }
    });
  }

  return (
    <form onSubmit={submeter} className="form-status-espaco">
      <div className="alerta-status-header">
        <div className={`status-icone-box ${ativo ? "icone-desativar" : "icone-reativar"}`}>
          <Icone size={24} />
        </div>
        <div>
          <p className="status-titulo-aviso">
            Você vai {verbo} {nome}
          </p>
          <p className="status-subtitulo-aviso">
            {ativo
              ? `O ${entidade} será marcado como inativo e o histórico é preservado.`
              : `O ${entidade} voltará ao status ativo no sistema.`}
          </p>
        </div>
      </div>

      <p className="alerta-aviso-box">
        Por segurança e auditoria, informe o motivo e confirme com sua senha de acesso.
      </p>

      <Campo label={`Justificativa para ${verbo}`} obrigatorio>
        <textarea
          required
          rows={3}
          value={justificativa}
          onChange={(e) => setJustificativa(e.target.value)}
          placeholder={`Descreva por que este ${entidade} será ${ativo ? "desativado" : "reativado"}...`}
          className="campo-input campo-textarea"
        />
      </Campo>

      <Campo label="Senha de confirmação" obrigatorio>
        <div className="input-com-icone-wrapper">
          <Lock className="input-icone-esquerda" size={16} />
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            autoComplete="current-password"
            className="campo-input input-com-icone"
          />
        </div>
      </Campo>

      <MensagemErro texto={erro} />
      <RodapeBotoes
        onCancelar={onClose}
        carregando={pendente}
        perigo={ativo}
        textoPrincipal={ativo ? "Confirmar desativação" : "Confirmar reativação"}
      />
    </form>
  );
}
