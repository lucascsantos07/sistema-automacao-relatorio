import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

// Layout principal do Dashboard: Topbar fixa no topo e Sidebar fixa à esquerda
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Topbar nome="Administrador" cargo="Gestão de Clientes" role="admin" />
      <div className="pt-[72px]">
        <Sidebar />
        <main className="min-h-[calc(100vh-72px)] p-4 sm:p-8 lg:pl-72">{children}</main>
      </div>
    </div>
  );
}
