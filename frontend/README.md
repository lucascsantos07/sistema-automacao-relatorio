# Lumina Gestão - Módulo de Clientes (Frontend Integrado)

Este projeto é a versão dedicada ao **CRUD de Clientes**, mantendo 100% da identidade visual, campos, máscaras e regras de negócio do design original da Lumina, preparado para consumir uma **API REST conectada a um banco PostgreSQL**.

---

## 🚀 Como Executar o Frontend

1. **Instalar as dependências:**
   ```bash
   npm install
   ```

2. **Configurar as variáveis de ambiente:**
   O arquivo `.env.local` já vem pré-configurado:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
   *(Ajuste a porta ou endereço caso o backend do seu colega esteja rodando em outro local).*

3. **Iniciar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000). A aplicação abrirá diretamente na tela de **Clientes**.

---

## 🛠️ Para o Integrante do Backend (PostgreSQL + REST)

* O script SQL para criação da tabela no PostgreSQL e dados de teste está em: **`database/schema.sql`**.
* O contrato detalhado de cada rota (`GET`, `POST`, `PUT`, `PATCH`) e um exemplo pronto de servidor em Node.js com Express e `pg` estão em: **`BACKEND_GUIA_INTEGRACAO.md`**.

---

## 🎨 O que foi preservado:
* **Telas, campos e cores:** 100% mantidos exatamente como no projeto original (tema Lumina com tons de roxo/rosa e layout limpo).
* **Validações e máscaras:** Máscara de CPF, CNPJ e telefone enquanto digita, além de validação matemática de dígitos verificadores de CPF e CNPJ no envio.
* **Componentes de interação:** Modais de cadastro, edição, visualização de detalhes e alteração de status com justificativa.
