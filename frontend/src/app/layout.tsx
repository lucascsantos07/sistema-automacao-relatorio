import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // fonte do Google carregada e hospedada pelo próprio Next
import "./globals.css"; // estilos globais + Tailwind

// Configura a fonte e a expõe como variável CSS --font-jakarta (usada no @theme)
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Lumina Gestão Digital", // título da aba
  description: "Sistema de gestão de clientes e funcionários",
};

// Layout raiz: envolve TODAS as páginas
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      {/* font-sans aplica a fonte; antialiased suaviza o texto */}
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
