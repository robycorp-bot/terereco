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
- Atlas editorial de 63 itens: 44 ervas, 11 copos/guampas e 8 bombas.
- Busca sem acentos, filtros por categoria, marca e seis famílias de sabor, com carregamento progressivo.
- Comparação de até três itens da mesma categoria e favoritos salvos neste navegador.
- Descoberta por perfil, com referências de marcas diferentes.
- Quinze dossiês de marcas do Brasil, Paraguai e Argentina, com história/contexto, linhas e fontes.
- Guia de moagem, ingredientes, aromas, descanso, filtros de bombas e materiais dos copos.
- Sessenta fotografias adicionais baixadas e creditadas em `web/assets/catalog/sources.json`.
- Menu mobile, navegação por teclado e modo de movimento reduzido.

A modelagem 3D é uma criação da experiência, não uma digitalização de um produto de marca. As fotografias de produtos vêm das fontes indicadas nas fichas. Consulte Fontes & créditos no rodapé para autores, licenças e referências históricas.

## Estrutura

`web/index.html` — conteúdo, seções e diálogos.  
`web/style.css` — layout e animações responsivas.  
`web/app.js` — catálogo, preferências e interações.  
`web/catalog-data.js` — conteúdo editorial, composições, fontes e dossiês.<br>
`web/catalog-photos.js` — caminhos das fotografias e suas referências.<br>
`web/guide.css` — estilos responsivos do atlas e do comparador.<br>
`web/scene.js` — cena WebGL com Three.js.  
`web/assets/` — fotografias e fontes locais.  
`web/vendor/` — Three.js local.  
`scripts/serve-local.mjs` — servidor estático restrito ao computador local.  
`scripts/build-static.mjs` — cópia estática para distribuição.

Antes de publicar, execute `node scripts/validate-catalog.mjs`. A integração do GitHub também verifica as fichas e a existência dos arquivos locais. Os scripts de coleta e download em `scripts/` são auxiliares de pesquisa; o site publicado não faz scraping e não depende de acesso aos sites de origem. Consulte os links de cada ficha para a composição atual. O conteúdo diferencia fontes oficiais e de revenda e não atribui benefícios clínicos às misturas.

Os arquivos anteriores da infraestrutura de Ads permanecem preservados nesta cópia, mas não são usados pelo servidor local nem pela versão estática. A versão visual anterior foi preservada em `work/backup/`.
