export function Campo({ label, obrigatorio, dica, children }) {
  return (
    <div className="campo-grupo">
      <label className="campo-label">
        <span>{label}</span>
        {obrigatorio && <span className="campo-obrigatorio">*</span>}
      </label>
      {children}
      {dica && <p className="campo-dica">{dica}</p>}
    </div>
  );
}

export function MensagemErro({ texto }) {
  if (!texto) return null;
  return (
    <div role="alert" className="mensagem-erro-box">
      {texto}
    </div>
  );
}

export function RodapeBotoes({
  onCancelar,
  carregando,
  textoPrincipal,
  perigo = false,
}) {
  return (
    <div className="rodape-botoes">
      <button
        type="button"
        disabled={carregando}
        onClick={onCancelar}
        className="btn btn-secondary"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={carregando}
        className={`btn ${perigo ? "btn-danger" : "btn-primary"}`}
      >
        {carregando ? "Processando..." : textoPrincipal}
      </button>
    </div>
  );
}
