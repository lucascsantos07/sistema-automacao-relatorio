"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  titulo: string; // título grande
  descricao?: string; // subtítulo
  onClose: () => void; // chamado ao fechar (X, clique fora ou Esc)
  largura?: string; // classe de largura máxima
  children: React.ReactNode; // conteúdo do modal
};

// Modal genérico reutilizado por todos os modais do sistema.
export default function Modal({ titulo, descricao, onClose, largura = "max-w-2xl", children }: Props) {
  // Fecha com a tecla Esc
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", aoTeclar); // registra ao abrir
    return () => window.removeEventListener("keydown", aoTeclar); // remove ao fechar (evita vazamento)
  }, [onClose]);

  return (
    // Fundo escurecido cobrindo a tela; clicar nele fecha o modal
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-plum-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      {/* role="dialog" + aria-modal informam leitores de tela que é um diálogo */}
      <div role="dialog" aria-modal="true" aria-label={titulo}
        className={`animate-modal-in my-auto w-full ${largura} rounded-2xl bg-white shadow-2xl`}>
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-bold">{titulo}</h2>
            {descricao && <p className="mt-1 text-sm text-slate-500">{descricao}</p>}
          </div>
          <button onClick={onClose} aria-label="Fechar" className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
