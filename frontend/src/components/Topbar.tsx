"use client";

import { Menu } from "lucide-react";
import { iniciais } from "@/lib/utils";

type Props = {
  nome?: string;
  cargo?: string;
  role?: string;
};

export default function Topbar({
  nome = "Gestor",
  cargo = "Administração",
  role = "admin",
}: Props) {
  function alternarMenu() {
    const el = document.documentElement;
    el.dataset.sidebarOpen = el.dataset.sidebarOpen === "true" ? "false" : "true";
  }

  const nivel = role === "admin" ? "Administrador" : "Colaborador";
  const primeiroNome = nome.split(" ")[0];

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-[72px] items-center justify-between bg-plum-950 px-4 text-white sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={alternarMenu}
          aria-label="Abrir menu"
          className="rounded-lg p-2 hover:bg-plum-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-serif text-lg font-bold">
            L
          </div>
          <div className="leading-tight">
            <p className="text-lg font-bold tracking-[0.2em]">LUMINA</p>
            <p className="text-[10px] tracking-[0.2em] text-white/60">GESTÃO DIGITAL</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right leading-tight sm:block">
          <p className="font-semibold">Olá, {primeiroNome}</p>
          <p className="text-sm text-white/70">
            {cargo} · {nivel}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold">
          {iniciais(nome)}
        </div>
      </div>
    </header>
  );
}
