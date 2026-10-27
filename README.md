# Meu Terereco

Experiência local sobre o tereré, suas raízes guaranis, marcas, ervas, copos e bombas.

## Abrir

Execute `abrir-site.cmd` nesta pasta e acesse http://127.0.0.1:4174/.

Com Node.js instalado:

```sh
npm start
```

Os arquivos e a biblioteca 3D são locais. Não precisa instalar dependências para iniciar.

## Gerar versão estática

```sh
npm run build
npm run preview
```

A saída fica em `dist-local/`. O código ativo está em `web/`.

## Experiência

- Guampa e bomba 3D com materiais oliva, couro e inox; arraste ou use as setas.
- Loader com progresso, entrada antecipada e replay.
- Fotografias reais de erva-mate, colheita e equipamentos.
- Catálogo com filtros, ficha de produto e favoritos salvos neste navegador.
- Descoberta de erva por perfil de sabor.
- Oito referências de marcas e histórico com fontes.
- Menu mobile, navegação por teclado e modo de movimento reduzido.

A modelagem 3D é uma criação da experiência, não uma digitalização de um produto de marca. As fotografias de produtos vêm das fontes indicadas nas fichas. Consulte Fontes & créditos no rodapé para autores, licenças e referências históricas.

## Estrutura

`web/index.html` — conteúdo, seções e diálogos.  
`web/style.css` — layout e animações responsivas.  
`web/app.js` — catálogo, preferências e interações.  
`web/scene.js` — cena WebGL com Three.js.  
`web/assets/` — fotografias e fontes locais.  
`web/vendor/` — Three.js local.  
`scripts/serve-local.mjs` — servidor estático restrito ao computador local.  
`scripts/build-static.mjs` — cópia estática para distribuição.

Os arquivos anteriores da infraestrutura de Ads permanecem preservados nesta cópia, mas não são usados pelo servidor local nem pela versão estática. A versão visual anterior foi preservada em `work/backup/`.
