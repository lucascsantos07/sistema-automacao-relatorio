# Guia de Integração do Frontend com o Backend (PostgreSQL + REST)

Este documento especifica a comunicação entre o **Frontend** e a API REST do **Backend**, baseado no documento de modelos oficial (`docs/doc-modelos.md`).

---

## 1. Modelo de Dados (`CLIENTE`)
Conforme definido no modelo relacional:
* `id`: SERIAL (PK)
* `nome`: VARCHAR(150)
* `email`: VARCHAR(150)
* `cpf_cnpj`: VARCHAR(14) - Único, sem máscara (11 dígitos para PF e 14 dígitos para PJ)
* `username`: VARCHAR(30) - Único, sem o símbolo `@`
* `telefone`: VARCHAR(15)
* `endereco`: VARCHAR(200)
* `ativo`: BOOLEAN - Default true (Exclusão lógica: nunca é deletado do banco)
* `justificativa_exclusao`: VARCHAR(250) - Preenchida ao inativar
* `justificativa_ativacao`: VARCHAR(250) - Preenchida ao reativar

---

## 2. Endpoints da API REST

A URL base configurada no frontend é: `http://localhost:3001` (configurável via `NEXT_PUBLIC_API_URL`).

### 1. Listar Clientes
* **Método:** `GET`
* **Rota:** `/clientes`
* **Query Params suportados:**
  * `q` (busca por nome, email, username ou cpf_cnpj)
  * `tipo` (`PF` ou `PJ`)
  * `status` (`ativo` ou `inativo`)
  * `page` (número da página)
  * `limit` (itens por página, padrão 10)
* **Resposta esperada:**
```json
{
  "clientes": [
    {
      "id": 1,
      "nome": "Ana Beatriz Souza",
      "email": "ana.souza@email.com",
      "cpf_cnpj": "12345678909",
      "username": "anasouza",
      "telefone": "(11) 98765-4321",
      "endereco": "Av. Paulista, 1000 - São Paulo/SP",
      "ativo": true
    }
  ],
  "total": 1
}
```

### 2. Cadastrar Cliente
* **Método:** `POST`
* **Rota:** `/clientes`
* **Payload (JSON):**
```json
{
  "nome": "Carlos Silva",
  "email": "carlos@email.com",
  "cpf_cnpj": "12345678901",
  "username": "carlos.silva",
  "telefone": "(11) 98888-7777",
  "endereco": "Rua das Flores, 123",
  "ativo": true
}
```

### 3. Editar Cliente
* **Método:** `PUT`
* **Rota:** `/clientes/:id`
* **Payload (JSON):**
```json
{
  "nome": "Carlos Alberto Silva",
  "email": "carlos.novo@email.com",
  "username": "carlos.alberto",
  "telefone": "(11) 98888-7777",
  "endereco": "Nova Rua, 456"
}
```

### 4. Alternar Status (Ativação / Exclusão Lógica)
* **Método:** `PATCH` (ou `PUT`)
* **Rota:** `/clientes/:id/status`
* **Payload (JSON):**
```json
{
  "ativo": false,
  "justificativa_exclusao": "Solicitado pelo cliente",
  "senha": "senha-opcional"
}
```
*(Para reativação, o campo enviado é `justificativa_ativacao`).*
