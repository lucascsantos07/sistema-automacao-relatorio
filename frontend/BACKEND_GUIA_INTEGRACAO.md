# Guia de Integração do Backend (PostgreSQL + REST API)

Este documento foi preparado para o integrante do grupo responsável pelo **Backend**. Ele detalha os contratos de API e a estrutura do banco PostgreSQL que o frontend espera consumir.

---

## 1. Banco de Dados (PostgreSQL)

O script SQL de criação da tabela está localizado em `database/schema.sql`.

### Estrutura da Tabela `clientes`:
| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` ou `SERIAL` | Identificador único |
| `tipo_pessoa` | `VARCHAR(2)` | `'PF'` (Pessoa Física) ou `'PJ'` (Pessoa Jurídica) |
| `nome` | `VARCHAR(255)` | Nome completo ou Razão Social |
| `documento` | `VARCHAR(20)` | Somente dígitos (CPF ou CNPJ) - Único |
| `email` | `VARCHAR(255)` | E-mail de contato |
| `telefone` | `VARCHAR(30)` | Telefone com DDD |
| `instagram` | `VARCHAR(100)` | Nome de usuário no Instagram (ex: `@empresa`) |
| `endereco` | `TEXT` | Endereço completo |
| `status` | `VARCHAR(10)` | `'ativo'` ou `'inativo'` (padrão: `'ativo'`) |
| `created_at` | `TIMESTAMPTZ` | Data de cadastro (padrão: `NOW()`) |

---

## 2. Endpoints da API REST

A URL base configurada no frontend por padrão é: `http://localhost:3001` (configurável via `NEXT_PUBLIC_API_URL` no `.env.local`).

> **Importante:** Habilite o **CORS** no backend para permitir requisições vindas de `http://localhost:3000`.

### 1. Listar Clientes
* **Método:** `GET`
* **Rota:** `/clientes`
* **Query Params opcionais:**
  * `q` (termo de busca: nome, email, instagram ou documento)
  * `tipo` (`PF` ou `PJ`)
  * `status` (`ativo` ou `inativo`)
  * `page` (número da página, ex: `1`)
  * `limit` (itens por página, ex: `10`)
* **Resposta esperada (Status 200):**
```json
{
  "clientes": [
    {
      "id": "e5c6a1b2-...",
      "tipo_pessoa": "PF",
      "nome": "Ana Beatriz Souza",
      "documento": "12345678909",
      "email": "ana.souza@gmail.com",
      "telefone": "(11) 98765-4321",
      "instagram": "@anasouza",
      "endereco": "Av. Paulista, 1000 - São Paulo/SP",
      "status": "ativo",
      "created_at": "2026-11-16T20:00:00.000Z"
    }
  ],
  "total": 1
}
```
*(Nota: O frontend também aceita se o backend retornar o array direto `[ ... ]`)*

---

### 2. Cadastrar Cliente
* **Método:** `POST`
* **Rota:** `/clientes`
* **Corpo da requisição (JSON):**
```json
{
  "tipo_pessoa": "PF",
  "nome": "Carlos Silva",
  "documento": "12345678901",
  "email": "carlos@email.com",
  "telefone": "(11) 98888-7777",
  "instagram": "@carlos",
  "endereco": "Rua das Flores, 123"
}
```
* **Resposta esperada:** Status `201` com `{ "ok": true }` ou os dados do cliente cadastrado.

---

### 3. Editar Cliente
* **Método:** `PUT`
* **Rota:** `/clientes/:id`
* **Corpo da requisição (JSON):**
```json
{
  "nome": "Carlos Alberto Silva",
  "email": "carlos.novo@email.com",
  "telefone": "(11) 98888-7777",
  "instagram": "@carlosalberto",
  "endereco": "Nova Rua, 456"
}
```
* **Resposta esperada:** Status `200` com `{ "ok": true }`.

---

### 4. Alterar Status (Ativar / Desativar)
* **Método:** `PATCH` (ou `PUT`)
* **Rota:** `/clientes/:id/status` (ou `/clientes/:id`)
* **Corpo da requisição (JSON):**
```json
{
  "status": "inativo",
  "justificativa": "Cliente solicitou encerramento temporário",
  "senha": "senha-opcional"
}
```
* **Resposta esperada:** Status `200` com `{ "ok": true }`.

---

## 3. Exemplo Mínimo de Backend (Node.js + Express + `pg`)

Caso o colega queira um ponto de partida rápido para testar tudo em 5 minutos:

```bash
mkdir backend
cd backend
npm init -y
npm install express cors pg dotenv
```

Arquivo `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://usuario:senha@localhost:5432/lumina_db'
});

// Listagem
app.get('/clientes', async (req, res) => {
  try {
    const { q, tipo, status, page = 1, limit = 10 } = req.query;
    let query = 'SELECT * FROM clientes WHERE 1=1';
    const params = [];

    if (tipo) {
      params.push(tipo);
      query += ` AND tipo_pessoa = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (q) {
      params.push(`%${q}%`);
      query += ` AND (nome ILIKE $${params.length} OR email ILIKE $${params.length} OR documento ILIKE $${params.length})`;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ clientes: result.rows, total: result.rows.length });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Cadastro
app.post('/clientes', async (req, res) => {
  try {
    const { tipo_pessoa, nome, documento, email, telefone, instagram, endereco } = req.body;
    const q = `INSERT INTO clientes (tipo_pessoa, nome, documento, email, telefone, instagram, endereco, status)
               VALUES ($1, $2, $3, $4, $5, $6, $7, 'ativo') RETURNING *`;
    const result = await pool.query(q, [tipo_pessoa, nome, documento, email, telefone, instagram, endereco]);
    res.status(201).json({ ok: true, cliente: result.rows[0] });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Edição
app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, instagram, endereco } = req.body;
    const q = `UPDATE clientes SET nome = $1, email = $2, telefone = $3, instagram = $4, endereco = $5
               WHERE id = $6 RETURNING *`;
    await pool.query(q, [nome, email, telefone, instagram, endereco, id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Alteração de Status
app.patch('/clientes/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const busca = await pool.query('SELECT status FROM clientes WHERE id = $1', [id]);
    if (busca.rows.length === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
    const novoStatus = busca.rows[0].status === 'ativo' ? 'inativo' : 'ativo';

    await pool.query('UPDATE clientes SET status = $1 WHERE id = $2', [novoStatus, id]);
    res.json({ ok: true, status: novoStatus });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.listen(3001, () => {
  console.log('Servidor backend rodando em http://localhost:3001');
});
```
