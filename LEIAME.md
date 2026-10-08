# Calendário da equipe — Netlify

Estrutura:
- public/index.html — o calendário
- netlify/functions/calendario.mjs — guarda os dados compartilhados (Netlify Blobs)
- netlify.toml e package.json — configuração

## Como publicar
Opção A (GitHub): suba esta pasta em um repositório → Netlify → Add new site → Import from Git.
Opção B (terminal): npm i -g netlify-cli && netlify deploy --prod

## Proteção (recomendado)
No Netlify: Site configuration → Environment variables → adicione CODIGO_EQUIPE com uma senha.
Cada pessoa digita o código uma vez no primeiro acesso. Depois faça um novo deploy.
Sem essa variável, qualquer pessoa com o link pode editar.
