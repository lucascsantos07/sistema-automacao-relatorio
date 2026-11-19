import ClientesTable from "@/components/clientes/ClientesTable";
import { listarClientes } from "@/lib/api";

const POR_PAGINA = 10;

export default async function ClientesPage({ searchParams }) {
  const sp = await searchParams;
  const pagina = Math.max(1, Number(sp?.page) || 1);
  const q = sp?.q || "";
  const tipo = sp?.tipo || "";
  const status = sp?.status || "";

  const { clientes, total } = await listarClientes({
    q,
    tipo,
    status,
    pagina,
    porPagina: POR_PAGINA,
  });

  return (
    <ClientesTable
      clientes={clientes}
      total={total}
      pagina={pagina}
      porPagina={POR_PAGINA}
    />
  );
}
