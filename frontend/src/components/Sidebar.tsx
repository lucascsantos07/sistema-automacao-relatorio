"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, UserPlus } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.sidebarOpen = "false";
  }, [pathname]);

  const itens = [
    { href: "/clientes", rotulo: "Clientes", icone: UserPlus },
  ];

  return (
    <aside className="fixed bottom-0 left-0 top-[72px] z-30 flex w-64 -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 [html[data-sidebar-open=true]_&]:translate-x-0">
      <nav className="flex-1 space-y-1 p-4">
        {itens.map(({ href, rotulo, icone: Icone }) => {
          const ativo = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={ativo ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                ativo ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icone className="h-5 w-5" />
              {rotulo}
            </Link>
          );
        })}

        {/* Item ilustrativo mantido exatamente como na tela original */}
        <div className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-400" aria-disabled>
          <BarChart3 className="h-5 w-5" /> Relatórios
          <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-[10px]">EM BREVE</span>
        </div>
      </nav>
    </aside>
  );
}
