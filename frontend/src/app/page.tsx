import { redirect } from "next/navigation";

// A rota "/" não tem conteúdo: manda para /clientes (o middleware cuida de quem não está logado).
export default function Home() {
  redirect("/clientes");
}
