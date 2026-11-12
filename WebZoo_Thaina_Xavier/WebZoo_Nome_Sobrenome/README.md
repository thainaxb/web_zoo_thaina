# WebZoo — Plataforma de Educação Ambiental

Projeto prático desenvolvido na disciplina de **Front-End** no **SENAI “Comendador Santoro Mirone”** (Indaiatuba/SP).

- **Estudante:** [Seu Nome Completo]
- **Turma:** [Sua Turma]
- **Link publicado:** [Cole aqui o link do GitHub Pages / Netlify / Vercel]
- **Repositório:** [Cole aqui o link do repositório]

## Páginas do site

- `index.html`: Apresentação do WebZoo, missão/visão/valores, animais em destaque e curiosidades.
- `animais.html`: Fichas técnicas da onça-pintada, tucano-toco e capivara, filtros combinados, favoritos em `localStorage` e resumo dinâmico da Wikipédia.
- `visite.html`: Horários, tabela acessível de ingressos, consulta de CEP de partida, previsão do tempo em tempo real, regras e perguntas frequentes.
- `participe.html`: Programas de educação ambiental, formulário validado com autopreenchimento de endereço por CEP e lista de cuidados com a natureza.

## APIs públicas utilizadas

1. **ViaCEP** (`https://viacep.com.br/ws/{cep}/json/`)
   - *Onde aparece:* `visite.html` (descoberta do ponto de partida) e `participe.html` (autopreenchimento de rua, bairro, cidade e estado).
2. **Open-Meteo** (`https://api.open-meteo.com/v1/forecast`)
   - *Onde aparece:* `visite.html` (temperatura atual, máxima, mínima, probabilidade de chuva e dica de passeio para o Zoológico de São Paulo).
3. **API REST da Wikipédia** (`https://pt.wikipedia.org/api/rest_v1/page/summary/{titulo}`)
   - *Onde aparece:* `animais.html` (botão “Saiba mais” nas fichas de cada espécie).

## Interações em JavaScript

- Menu hambúrguer acessível com controle de foco pelo teclado e fechamento com `Esc` (`js/menu.js`).
- Botão “Voltar ao topo” (`js/menu.js`).
- Filtros por classe, alimentação, bioma e favoritos salvos no `localStorage` (`js/animais.js`).
- Validação acessível campo a campo, máscaras de CEP e telefone e contador de caracteres (`js/formulario.js`).

## Créditos e ferramentas de IA

- Imagens fornecidas no material da atividade (geradas por IA para fins didáticos).
- Fontes tipográficas: *Merriweather* e *Source Sans 3* via Google Fonts.
- Ferramenta de IA utilizada como apoio no planejamento, revisão semântica e estruturação de código: **Google Gemini**.
