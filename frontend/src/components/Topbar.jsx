"use client";

import { Menu } from "lucide-react";
import { iniciais } from "@/lib/utils";

export default function Topbar({
  nome = "Gestor",
  cargo = "Administração",
  role = "admin",
}) {
  function alternarMenu() {
    const el = document.documentElement;
    el.dataset.sidebarOpen = el.dataset.sidebarOpen === "true" ? "false" : "true";
  }

  const nivel = role === "admin" ? "Administrador" : "Colaborador";
  const primeiroNome = nome.split(" ")[0];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          onClick={alternarMenu}
          aria-label="Abrir menu"
          className="topbar-hamburger"
        >
          <Menu size={20} />
        </button>
        <div className="topbar-brand">
          <div className="topbar-logo-icon">L</div>
          <div className="topbar-brand-text">
            <p className="topbar-logo-title">LUMINA</p>
            <p className="topbar-logo-sub">GESTÃO DIGITAL</p>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-user-info">
          <p className="topbar-user-name">Olá, {primeiroNome}</p>
          <p className="topbar-user-role">
            {cargo} · {nivel}
          </p>
        </div>
        <div className="topbar-avatar">{iniciais(nome)}</div>
      </div>
    </header>
  );
}
