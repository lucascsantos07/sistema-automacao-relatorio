// Tipos compartilhados da aplicação Lumina (CRUD de Clientes)

export type Status = "ativo" | "inativo";
export type TipoPessoa = "PF" | "PJ";

// Modelo de um cliente no banco de dados / API
export type Cliente = {
  id: string;
  tipo_pessoa: TipoPessoa;
  nome: string;
  documento: string; // apenas dígitos (CPF ou CNPJ)
  email: string;
  telefone: string;
  instagram: string;
  endereco: string;
  status: Status;
  created_at?: string;
};

// Retorno padrão de operações de mutação (Server Actions / chamadas de API)
export type ActionResult = { ok: true; mensagem?: string } | { ok: false; erro: string };

// Resposta esperada da listagem com paginação
export type ListarClientesResponse = {
  clientes: Cliente[];
  total: number;
};
