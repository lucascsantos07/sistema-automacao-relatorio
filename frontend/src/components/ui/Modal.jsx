"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  titulo,
  descricao,
  onClose,
  largura = "modal-mediano",
  children,
}) {
  useEffect(() => {
    const aoTeclar = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`modal-dialog ${largura}`}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-titulo">{titulo}</h2>
            {descricao && <p className="modal-descricao">{descricao}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="modal-btn-fechar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
