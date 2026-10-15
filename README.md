# 🤟 Scassiotti Quest: O Resgate da Inclusão

> Jogo educativo web **Deaf-First** (Libras L1 ➔ Português L2) desenvolvido para a disciplina de **Seminários III** (Ciência da Computação — Orientação: **Profª Tarso**).

---

## 🎯 Sobre o Projeto

**Scassiotti Quest: O Resgate da Inclusão** é uma Single Page Application (SPA) gamificada e acessível projetada para apoiar pessoas surdas no letramento funcional da Língua Portuguesa (L2) a partir da **Língua Brasileira de Sinais — Libras (L1)**, trabalhando simultaneamente **persistência, valores humanos, motivação, empatia e inclusão**.

### Principais Pilares Pedagógicos e de UX/UI (*Deaf-First*)
- **Tela de Vídeo em Libras antes da Montagem:** Antes de cada rodada, a **Profª Scassiotti** apresenta a explicação da frase em Libras (com suporte a vídeos `.mp4` em `1x Normal` / `0.5x Lento`, botão de teste ao vivo de arquivos `.mp4` e estúdio visual passo a passo enquanto os vídeos definitivos não forem gravados).
- **Codificação Tripla Redundante (Forma + Cor + Papel Sintático):** Cada encaixe sintático associa cor, ícone e pergunta funcional:
  - **1º QUEM (Sujeito)** — Azul
  - **2º AÇÃO (Verbo)** — Verde/Âmbar
  - **3º ALVO (Objeto)** — Violeta/Âmbar
- **Interação Dupla Acessível:** Funciona tanto por **1 clique/toque** quanto por **arrastar e soltar (Drag & Drop)** ou teclado (`Tab`, `Enter`, `Esc`).
- **Feedback Visual Redundante e Não-Punitivo:** Em vez de depender de áudio, utiliza ondas de choque visuais, barra de rastro de dano (*ghost bar*) e dicas formativas da professora.

---

## 🗺️ Estrutura das 6 Fases e Chefes

| Fase | Título | Valor Trabalhado / Gramática | Chefe (Barreira) |
| :--- | :--- | :--- | :--- |
| **Fase 1** | *O Acolhimento na Escola* | Apoio escolar e Ordem SVO | **Barreira da Insegurança** |
| **Fase 2** | *A Força da Comunidade* | União familiar, intérprete e Ordem SVO | **Espectro da Hesitação** |
| **Fase 3** | *O Poder da Persistência* | Superação e Concordância no Plural (`+`) | **Colosso do Desânimo** |
| **Fase 4** | *Pontes da Empatia* | Amizade, esperança e Preposições (`em`, `no`) | **Guardião do Isolamento** |
| **Fase 5** | *A Chama da Motivação* | Sonhos, coragem e Autoconfiança | **Tempestade da Dúvida** |
| **Fase 6** | *A Vitória da Inclusão* | Respeito, igualdade e transformação social | **Muralha do Preconceito** |

---

## 🛠️ Tecnologias Utilizadas (Custo Zero de Infraestrutura)

- **Vue 3** (`<script setup>` + Composition API)
- **Tailwind CSS 3** (Design System *"Crepúsculo no Campus"*)
- **Vite 6** (Build estático ultrarrápido, pronto para GitHub Pages / Vercel / Netlify)
- **Lucide Icons** + **Canvas Confetti** + **Fontsource Nunito Variable** (100% auto-hospedado, funciona offline)

---

## 🚀 Como Executar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Gere a versão de produção estática (`dist/`):
   ```bash
   npm run build
   ```

---

## 📹 Como Adicionar os Vídeos Gravados em Libras (`.mp4`)

Basta salvar os arquivos `.mp4` na pasta [`public/videos/`](./public/videos/README.md) seguindo os nomes listados na documentação da pasta, ou usar o botão **"Testar arquivo .mp4"** diretamente dentro da tela de vídeo do jogo para carregar qualquer vídeo do computador na hora.
