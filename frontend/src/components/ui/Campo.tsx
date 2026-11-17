// Pequenos blocos de formulário reutilizados.

// Classe padrão dos <input>/<select>/<textarea>; `disabled:` estiliza campos bloqueados
export const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

type Props = { label: string; obrigatorio?: boolean; dica?: string; children: React.ReactNode };

// Rótulo + asterisco de obrigatório + dica opcional à direita, envolvendo o campo
export function Campo({ label, obrigatorio, dica, children }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-semibold">
        <span>
          {label} {obrigatorio && <span className="text-brand-500">*</span>}
        </span>
        {dica && <span className="font-normal text-slate-400">{dica}</span>}
      </span>
      {children}
    </label>
  );
}

// Faixa de mensagem de erro de formulário
export function MensagemErro({ texto }: { texto: string | null }) {
  if (!texto) return null; // sem erro, não renderiza nada
  return <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{texto}</p>;
}

// Botões padrão de rodapé: Cancelar + ação principal
export function RodapeBotoes(props: {
  onCancelar: () => void; textoPrincipal: string; carregando: boolean; perigo?: boolean;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
      <button type="button" onClick={props.onCancelar}
        className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">Cancelar</button>
      <button type="submit" disabled={props.carregando}
        className={`rounded-lg px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 ${
          props.perigo ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"
        }`}>
        {props.carregando ? "Aguarde..." : props.textoPrincipal}
      </button>
    </div>
  );
}
