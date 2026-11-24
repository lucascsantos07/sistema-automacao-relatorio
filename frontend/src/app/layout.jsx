import "./globals.css";

export const metadata = {
  title: "Lumina Gestão Digital",
  description: "Sistema de gestão de clientes e automação",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
