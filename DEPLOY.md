# Publicar no Render

O site usa HTML, CSS e JavaScript nativo, com Three.js local para o 3D. Não usa Python, banco de dados, framework ou instalação de pacotes para publicar.

1. Envie este repositório para o GitHub.
2. No Render, crie um Blueprint a partir desse repositório e do arquivo `render.yaml`. Ele cria somente um Static Site chamado `meu-terereco`.
3. Aguarde a primeira publicação. Na página Settings desse site, copie o Deploy Hook.
4. No GitHub, em Settings → Secrets and variables → Actions, crie o secret `RENDER_DEPLOY_HOOK_URL` com o hook. Não o coloque em arquivos nem em mensagens.
5. Execute a Action `Validate and deploy static site to Render` ou envie um novo commit para `main`.

A Action valida o JavaScript, gera os arquivos estáticos e solicita ao Render a publicação do mesmo SHA validado. Pull requests só validam; não publicam. A implantação automática do Render fica desativada para evitar duplicação com a Action.

Sem o secret, a etapa de publicação falha com uma instrução clara; isso não significa que o site foi publicado. A resposta do hook confirma que a publicação começou, não que terminou. O resultado final aparece no painel do Render.

Configuração manual equivalente: tipo Static Site, branch main, build `node scripts/build-static.mjs`, pasta de publicação `dist-local`.

Sites estáticos são gratuitos no Render, dentro das franquias de uso do workspace. Consulte https://render.com/docs/free e https://render.com/docs/static-sites.

Referências: https://render.com/docs/blueprint-spec e https://render.com/docs/deploy-hooks.
