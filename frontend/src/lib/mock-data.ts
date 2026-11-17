import type { Cliente } from "@/lib/types";

// Dados estáticos iniciais para testes imediatos das telas
export const CLIENTES_ESTATICOS_INICIAIS: Cliente[] = [
  {
    id: "c1",
    tipo_pessoa: "PF",
    nome: "Ana Beatriz Souza",
    documento: "12345678909",
    email: "ana.souza@email.com",
    telefone: "(11) 98765-4321",
    instagram: "@anasouza",
    endereco: "Av. Paulista, 1000, Apto 42 - Bela Vista, São Paulo/SP",
    status: "ativo",
    created_at: "2026-11-10T10:00:00Z",
  },
  {
    id: "c2",
    tipo_pessoa: "PJ",
    nome: "Tech Solutions Consultoria Ltda",
    documento: "12345678000195",
    email: "contato@techsolutions.com.br",
    telefone: "(11) 3214-5678",
    instagram: "@techsolutions",
    endereco: "Rua Funchal, 200, Sala 501 - Vila Olímpia, São Paulo/SP",
    status: "ativo",
    created_at: "2026-11-11T14:30:00Z",
  },
  {
    id: "c3",
    tipo_pessoa: "PF",
    nome: "Carlos Eduardo Lima",
    documento: "98765432100",
    email: "carlos.lima@hotmail.com",
    telefone: "(21) 99887-6655",
    instagram: "@carloslima",
    endereco: "Rua Barata Ribeiro, 350 - Copacabana, Rio de Janeiro/RJ",
    status: "inativo",
    created_at: "2026-11-12T09:15:00Z",
  },
  {
    id: "c4",
    tipo_pessoa: "PJ",
    nome: "Agência Criativa Digital",
    documento: "98765432000180",
    email: "oi@agenciacriativa.com",
    telefone: "(84) 99123-4567",
    instagram: "@agenciacriativa",
    endereco: "Av. Hermes da Fonseca, 800 - Tirol, Natal/RN",
    status: "ativo",
    created_at: "2026-11-13T16:45:00Z",
  },
  {
    id: "c5",
    tipo_pessoa: "PF",
    nome: "Mariana Albuquerque Ferreira",
    documento: "45678912301",
    email: "mariana.albuquerque@gmail.com",
    telefone: "(31) 98456-1122",
    instagram: "@mari.albuquerque",
    endereco: "Rua da Bahia, 1200 - Lourdes, Belo Horizonte/MG",
    status: "ativo",
    created_at: "2026-11-14T11:20:00Z",
  },
  {
    id: "c6",
    tipo_pessoa: "PJ",
    nome: "Vanguarda Arquitetura & Design",
    documento: "33444555000166",
    email: "projetos@vanguardaarq.com.br",
    telefone: "(41) 3045-8899",
    instagram: "@vanguarda.arq",
    endereco: "Rua Comendador Araújo, 400 - Batel, Curitiba/PR",
    status: "ativo",
    created_at: "2026-11-14T18:00:00Z",
  },
  {
    id: "c7",
    tipo_pessoa: "PF",
    nome: "Rodrigo Mendes Castro",
    documento: "78912345602",
    email: "rodrigo.mendes@outlook.com",
    telefone: "(71) 99233-4411",
    instagram: "@rodrigo.mcastro",
    endereco: "Av. Oceânica, 550 - Barra, Salvador/BA",
    status: "inativo",
    created_at: "2026-11-15T08:30:00Z",
  },
  {
    id: "c8",
    tipo_pessoa: "PJ",
    nome: "Supermercado Progresso Eireli",
    documento: "55666777000188",
    email: "financeiro@superprogresso.com",
    telefone: "(51) 3322-1100",
    instagram: "@superprogresso",
    endereco: "Av. Assis Brasil, 2500 - Passo d'Areia, Porto Alegre/RS",
    status: "ativo",
    created_at: "2026-11-15T13:40:00Z",
  },
];

// Preserva o estado em memória entre requisições no modo de desenvolvimento do Next.js
const globalForMock = globalThis as unknown as { __lumina_clientes?: Cliente[] };

export function getClientesMock(): Cliente[] {
  if (!globalForMock.__lumina_clientes) {
    globalForMock.__lumina_clientes = [...CLIENTES_ESTATICOS_INICIAIS];
  }
  return globalForMock.__lumina_clientes;
}
