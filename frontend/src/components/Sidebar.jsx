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
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {itens.map(({ href, rotulo, icone: Icone }) => {
          const ativo = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${ativo ? "active" : ""}`}
            >
              <Icone size={20} />
              <span>{rotulo}</span>
            </Link>
          );
        })}

        <div className="sidebar-link-disabled" aria-disabled="true">
          <BarChart3 size={20} />
          <span>Relatórios</span>
          <span className="badge-em-breve">EM BREVE</span>
        </div>
      </nav>
    </aside>
  );
}
