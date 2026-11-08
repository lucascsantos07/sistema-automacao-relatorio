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

## Equipe de Desenvolvimento

- Flávia Juliana de Araújo Carvalho
- Jaine Souza da Luz
- Leandro Sérgio da Silva
- Lucas da Costa Santos
