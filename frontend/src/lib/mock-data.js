// Dados estáticos iniciais de clientes para testes
// Estruturados rigorosamente conforme a tabela CLIENTE do doc-modelos.md

export const CLIENTES_ESTATICOS_INICIAIS = [
  {
    id: 1,
    nome: "Ana Beatriz Souza",
    email: "ana.souza@email.com",
    cpf_cnpj: "12345678909", // 11 dígitos = PF
    username: "anasouza",     // sem o @
    telefone: "(11) 98765-4321",
    endereco: "Av. Paulista, 1000, Apto 42 - Bela Vista, São Paulo/SP",
    ativo: true,
    justificativa_exclusao: null,
    justificativa_ativacao: null,
  },
  {
    id: 2,
    nome: "Tech Solutions Consultoria Ltda",
    email: "contato@techsolutions.com.br",
    cpf_cnpj: "12345678000195", // 14 dígitos = PJ
    username: "techsolutions",
    telefone: "(11) 3214-5678",
    endereco: "Rua Funchal, 200, Sala 501 - Vila Olímpia, São Paulo/SP",
    ativo: true,
    justificativa_exclusao: null,
    justificativa_ativacao: null,
  },
  {
    id: 3,
    nome: "Carlos Eduardo Lima",
    email: "carlos.lima@hotmail.com",
    cpf_cnpj: "98765432100", // 11 dígitos = PF
    username: "carloslima",
    telefone: "(21) 99887-6655",
    endereco: "Rua Barata Ribeiro, 350 - Copacabana, Rio de Janeiro/RJ",
    ativo: false,
    justificativa_exclusao: "Cliente solicitou encerramento temporário de contrato.",
    justificativa_ativacao: null,
  },
  {
    id: 4,
    nome: "Agência Criativa Digital",
    email: "oi@agenciacriativa.com",
    cpf_cnpj: "98765432000180", // 14 dígitos = PJ
    username: "agenciacriativa",
    telefone: "(84) 99123-4567",
    endereco: "Av. Hermes da Fonseca, 800 - Tirol, Natal/RN",
    ativo: true,
    justificativa_exclusao: null,
    justificativa_ativacao: null,
  },
  {
    id: 5,
    nome: "Mariana Albuquerque Ferreira",
    email: "mariana.albuquerque@gmail.com",
    cpf_cnpj: "45678912301",
    username: "mari.albuquerque",
    telefone: "(31) 98456-1122",
    endereco: "Rua da Bahia, 1200 - Lourdes, Belo Horizonte/MG",
    ativo: true,
    justificativa_exclusao: null,
    justificativa_ativacao: null,
  },
  {
    id: 6,
    nome: "Vanguarda Arquitetura & Design",
    email: "projetos@vanguardaarq.com.br",
    cpf_cnpj: "33444555000166",
    username: "vanguarda.arq",
    telefone: "(41) 3045-8899",
    endereco: "Rua Comendador Araújo, 400 - Batel, Curitiba/PR",
    ativo: true,
    justificativa_exclusao: null,
    justificativa_ativacao: null,
  },
  {
    id: 7,
    nome: "Rodrigo Mendes Castro",
    email: "rodrigo.mendes@outlook.com",
    cpf_cnpj: "78912345602",
    username: "rodrigo.mcastro",
    telefone: "(71) 99233-4411",
    endereco: "Av. Oceânica, 550 - Barra, Salvador/BA",
    ativo: false,
    justificativa_exclusao: "Pausa estratégica para readequação de orçamento.",
    justificativa_ativacao: null,
  },
  {
    id: 8,
    nome: "Supermercado Progresso Eireli",
    email: "financeiro@superprogresso.com",
    cpf_cnpj: "55666777000188",
    username: "superprogresso",
    telefone: "(51) 3322-1100",
    endereco: "Av. Assis Brasil, 2500 - Passo d'Areia, Porto Alegre/RS",
    ativo: true,
    justificativa_exclusao: null,
    justificativa_ativacao: null,
  },
];

// Preserva o estado em memória entre requisições no modo desenvolvimento do Next.js
const globalForMock = globalThis;

export function getClientesMock() {
  if (!globalForMock.__lumina_clientes) {
    globalForMock.__lumina_clientes = [...CLIENTES_ESTATICOS_INICIAIS];
  }
  return globalForMock.__lumina_clientes;
}
