# ⚕️ MedSync

## Thainasp / medsync

O **MedSync** é um sistema de gerenciamento de saúde desenvolvido para auxiliar pessoas de diferentes faixas etárias, como idosos e jovens adultos com rotinas intensas, na organização de suas rotinas de cuidados diários [1-3]. O sistema visa promover maior autonomia e segurança, permitindo o acompanhamento de medicamentos, consultas e histórico médico [1].

O projeto foi desenvolvido por alunos do curso de **Tecnologia em Análise e Desenvolvimento de Sistemas** do Instituto Federal de São Paulo (**IFSP**), Câmpus Bragança Paulista, como avaliação parcial da disciplina de Análise Orientada a Objetos [4].

## Instruções de instalação da aplicação
Para instalar e executar o projeto, primeiro faça um clone do repositorio e abra a pasta principal. O backend, que utiliza Node.js e SQLite, está localizado dentro da pasta “backend”. Entre nela e instale as dependências usando o comando npm install. Depois disso, basta iniciar o servidor com npm run start, e ele ficará disponível em http://localhost:3001.

Em seguida, para configurar o frontend desenvolvido em React, acesse a pasta “frontend” e instale também as dependências com npm install. Após essa etapa, execute npm run dev para iniciar a aplicação, que abrirá em http://localhost:3000.

Com isso, o backend e o frontend estarão funcionando em conjunto, permitindo que você acesse e utilize o sistema diretamente pelo navegador.

## 📚 Documentação Técnica
Para uma análise aprofundada, detalhes de implementação, e o escopo completo do projeto, baixe o nosso documento oficial:

* **[Documentação Técnica MedSync (PDF)](./Documentacao_Tecnica_Medsync.pdf)**
*  **[Documentação Técnica Versão Final Medsync (PDF)] (./Documentacao_Tecnica_Final_Medsync.pdf).**

## 🎯 Objetivo e Funcionalidades

O objetivo central do MedSync é melhorar a disciplina terapêutica, reduzindo a dificuldade que muitos usuários enfrentam para seguir tratamentos complexos [2]. Para isso, o sistema oferece:

### 💊 Gerenciamento e Alertas (Requisitos Essenciais e Importantes)

*   **Alertas Personalizados:** Envio de notificações sonoras, visuais e por *push* (e-mail, WhatsApp) sobre o horário da medicação [1, 5, 6].
*   **Confirmação de Uso (RF32):** O usuário deve confirmar que tomou a medicação [7]. O sistema registra o status como "Tomado", "Adiado" ou "Cancelado" no histórico [7, 8].
*   **Gerenciamento de Medicamentos:** Cadastro detalhado de nome, dosagem, frequência e tipo de tratamento (contínuo ou temporário) [8].
*   **Interações Medicamentosas (RF12):** O sistema deve alertar sobre interações ao inserir o medicamento, utilizando a **API Bulário Digital** [8-10].
*   **Controle de Estoque (RF40):** Monitoramento do estoque de medicamentos para emitir aviso sobre a necessidade de compra quando o estoque for insuficiente para oito dias de tratamento [8, 11, 12].
*   **Gerenciamento de Receitas (RF17):** Permite o *upload* opcional de receitas (PDF, JPG, PNG) e envia notificações próximas à data de vencimento (RF26) [8].
*   **Exames (RF45):** Permite o *upload* e a exclusão de exames [8, 13].

### 🔒 Segurança e Acessibilidade (Requisitos Não Funcionais)

*   **Conformidade Legal:** Proteção de dados pessoais e clínicos seguindo a **LGPD (Lei Geral de Proteção de Dados)** (RNF09) [9, 14].
*   **Segurança:** Autenticação por senha (RNF03) e *backups* automáticos diários dos dados dos usuários (RNF13) [9, 14].
*   **Acessibilidade:** Interface intuitiva e acessível para diversas faixas etárias (RNF10), com suporte para leitores de tela, ajuste de fontes e alteração de padrão de cores (RNF11, RNF16) [5, 9].
*   **Multiplataforma:** Acessível via navegador web e aplicativo móvel, com design responsivo (RNF12) [5, 9].

## 💻 Arquitetura e Tecnologias

O projeto segue uma **abordagem de desenvolvimento ágil** e utiliza um conjunto moderno de tecnologias [15].

| Componente | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Frontend (Web)** | **JavaScript** (98.3%), **React** [16-18] | Utiliza **Vite** para *tooling* e suporta **HMR** (Hot Module Replacement) e **ESLint** [16]. |
| **Backend** | **JavaScript** com **Node** [10] |
| **Banco de Dados** | **SQlite** | Sistema de gerenciamento de banco de dados relacional. |
| **APIs** | **Google Calendar API**, **API Bulário Digital** [9, 10] | Integração com agenda e verificação de interações medicamentosas [10]. |
| **Infraestrutura** | **Git** / **GitHub**| Controle de versão e hospedagem |

## 🚀 Começando (Setup Técnico)

Este repositório (`Thainasp/medsync`) reflete a configuração inicial de um *template* que fornece o setup mínimo para o React funcionar no Vite [16].

### Estrutura de Arquivos (Parcial):

O repositório inclui os seguintes diretórios e arquivos [19]:
*   `public/ assets/ images/`
*   `src/`
*   `.gitignore`
*   `README.md`
*   `eslint.config.js`
*   `index.html`
*   `package-lock.json`
*   `package.json`
*   `vite.config.js`

## 📊 Estatísticas do Repositório

| Métrica | Valor | Fonte |
| :--- | :--- | :--- |
| **Estrelas** | **1** | [17, 19] |
| **Forks** | **1** | [17, 19] |
| **Contribuidores** | **3** | [17] |
| **Commits** | **46** | [19] |
| **Watchers** | **0** | [17] |
| **Releases** | **0** (Nenhuma publicada) | [17] |
| **Packages** | **0** (Nenhum publicado) | [17] |

## 👥 Desenvolvedores

O projeto MedSync foi desenvolvido por [4]:
*   EDUARDO SCHOOF
*   ISABELA DE MELO IZIDORIO
*   MARIANE FÁTIMA SILVA
*   THAINA DE SOUZA PEREIRA
