# SISTEMA DE AUTOMAÇÃO DE RELATÓRIOS

## Descrição

Sistema web para automatizar a geração de relatórios de desempenho das redes sociais dos clientes de uma agência de marketing digital. O sistema armazena os dados cadastrais dos clientes e as métricas de seus perfis do Instagram, criando um histórico permanente de desempenho. A partir desse histórico, gera painéis e relatórios padronizados, que podem ser exportados em PDF.

## Problema

A agência não possui um sistema de armazenamento de dados dos clientes. As métricas do Instagram ficam disponíveis por apenas 5 a 6 meses e, depois desse período, são perdidas, pois não há registro interno ou histórico armazenado.

Isso gera os seguintes problemas:

- Impossibilidade de recuperar dados ou relatórios antigos quando o cliente os solicita.
- Falta de parâmetros de comparação para demonstrar a evolução do desempenho do cliente.
- Retrabalho, perda de tempo e inconsistência nas análises.
- Relatórios feitos manualmente, sem padronização, com cada colaborador usando ferramentas como o Canva de forma individual.

## Solução

Propõe-se a automação desse processo por meio de um sistema que:

- Armazena os dados cadastrais dos clientes (CPF/CNPJ, nome, endereço, telefone e nome de usuário do Instagram) e as métricas de seus perfis (visualizações, alcance, engajamento, valor investido, CPC, CPM, cliques no link, conversas iniciadas e novos seguidores).
- Cria um histórico de desempenho ao longo do tempo.
- Extrai os dados automaticamente pela API da Meta e os armazena em banco de dados.
- Automatiza a geração de relatórios e gráficos, com exportação em PDF.
- Padroniza as entregas realizadas pela equipe.

Com isso, espera-se reduzir o retrabalho, evitar a perda de informações, aumentar a eficiência dos processos e melhorar a qualidade da análise dos resultados, contribuindo para uma melhor tomada de decisão.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | React com Next.js |
| Back-end | Python com Django |
| Banco de dados | PostgreSQL |

## Instrução para Banco de dados

O banco é um PostgreSQL 16 executado em Docker.

**Pré-requisito:** [Docker](https://docs.docker.com/get-docker/) com Docker Compose.

**Configuração inicial**

```bash
cp .env.example .env     # Windows (PowerShell): copy .env.example .env
```

Edite o `.env` e defina uma senha em `DB_PASSWORD`.

**Comandos**

| Ação | Comando |
|---|---|
| Subir o banco | `docker compose up -d` |
| Ver se está pronto | `docker compose ps` |
| Ver os logs | `docker compose logs -f db` |
| Parar o banco (mantém os dados) | `docker compose down` |
| Apagar o banco e os dados | `docker compose down -v` |

O banco sobe vazio. As tabelas são criadas pelas migrations do Django.

**Conexão**

| Parâmetro | Valor |
|---|---|
| Host | `localhost` |
| Porta | valor de `DB_PORT` (padrão 5432) |
| Banco, usuário e senha | valores do `.env` |

> O `docker compose down -v` **apaga todos os dados**. Use apenas para recriar o banco do zero.

## Back-end (Django - API REST)

**Pré-requisitos:** Python 3.11 ou superior e o banco de dados PostgreSQL em execução (seção anterior).

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows (PowerShell): .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env               # Windows (PowerShell): copy .env.example .env
```

Edite o `backend/.env`:
* Defina uma chave aleatória em `DJANGO_SECRET_KEY`.
* Use os mesmos valores de banco (`DB_NAME`, `DB_USER`, `DB_PASSWORD` e `DB_PORT`) configurados no `.env` da raiz.

Em seguida, aplique as migrations, carregue os dados de teste e inicie a API na porta **3001**:

```bash
python manage.py migrate                   # cria as tabelas no PostgreSQL
python manage.py loaddata clientes_teste   # carrega clientes de exemplo (fixture)
python manage.py runserver 0.0.0.0:3001    # inicia a API REST
```

A API REST estará disponível em `http://localhost:3001`.

### Endpoints da API REST

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/clientes` | Lista clientes. Suporta busca textual `q`, filtros `tipo` (PF/PJ), `status` (ativo/inativo) e paginação (`page`, `limit`). |
| `POST` | `/clientes` | Cadastra um novo cliente com validações de CPF/CNPJ e e-mail. |
| `GET` | `/clientes/<id>` | Retorna os detalhes de um cliente específico. |
| `PUT` | `/clientes/<id>` | Atualiza os dados cadastrais (`cpf_cnpj` e `ativo` são imutáveis via PUT). |
| `PATCH` | `/clientes/<id>/status` | Inativa ou reativa o cliente com justificativa de auditoria obrigatória. |

> O `DELETE` físico é bloqueado (HTTP 405). A exclusão de clientes é sempre lógica via `PATCH /clientes/<id>/status`.

### Rodando os testes automatizados

Os testes do backend usam SQLite em memória e não necessitam que o Docker esteja em execução:

```bash
cd backend
source .venv/bin/activate          # Windows (PowerShell): .venv\Scripts\Activate.ps1
DJANGO_SETTINGS_MODULE=config.settings_test python manage.py test clientes --verbosity=2
```

## Front-end (Next.js)

Interface web interativa desenvolvida em Next.js para gerenciamento e visualização dos clientes.

**Pré-requisitos:** Node.js 18 ou superior e npm.

```bash
cd frontend
npm install                        # instala as dependências
cp .env.example .env.local         # Windows (PowerShell): copy .env.example .env.local
npm run dev                        # inicia o servidor de desenvolvimento
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. A aplicação se conectará automaticamente à API em `http://localhost:3001`.

## Equipe de Desenvolvimento

- Flávia Juliana de Araújo Carvalho
- Jaine Souza da Luz
- Leandro Sérgio da Silva
- Lucas da Costa Santos
