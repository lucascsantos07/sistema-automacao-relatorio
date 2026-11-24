import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Topbar nome="Administrador" cargo="Gestão de Clientes" role="admin" />
      <div className="dashboard-content-wrapper">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
