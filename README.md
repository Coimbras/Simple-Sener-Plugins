# Plugins Sener simples

Plugin simples para o Obsidian que acrescenta três funcionalidades à visualização de ficheiros Markdown no **Modo de leitura**:

1. União horizontal e vertical de células de tabelas;
2. Legendas por baixo das imagens;
3. Títulos ou legendas por cima das tabelas.

O plugin não altera o conteúdo original do ficheiro Markdown. As transformações são aplicadas apenas quando a nota é apresentada no Modo de leitura.

## 1. União de células em tabelas

### União horizontal

Utilize o marcador `->N`, em que `N` representa o número total de colunas abrangidas, incluindo a própria célula.

```markdown
| Parâmetro | Valor | Unidade |
|---|---|---|
| ->3 Geometria da via | | |
| Raio | 350 | m |
```

Neste exemplo, a célula `Geometria da via` ocupa três colunas através de `colspan="3"`.

As `N-1` células seguintes devem estar vazias.

### União vertical

Utilize o marcador `-^N`, em que `N` representa o número total de linhas abrangidas, incluindo a própria linha.

```markdown
| Parâmetro | Valor |
|---|---|
| -^3 Raio | 350 m |
| | 400 m |
| | 500 m |
| Velocidade | 120 km/h |
```

Neste exemplo, a célula `Raio` ocupa três linhas através de `rowspan="3"`.

As `N-1` células seguintes, na mesma coluna, devem estar vazias.

## 2. Legendas de imagens

O plugin cria uma legenda por baixo da imagem a partir do texto alternativo definido no Markdown.

### Imagens incorporadas do Obsidian

```markdown
![[image.jpg|Esta é uma legenda]]
```

### Sintaxe Markdown normal

```markdown
![Esta é uma legenda](image.jpg)
```

Nos dois casos, o texto `Esta é uma legenda` é apresentado por baixo da imagem.

Se o texto alternativo estiver vazio, o plugin não cria uma legenda.

## 3. Títulos ou legendas de tabelas

Para criar um título por cima de uma tabela, coloque o texto entre parênteses rectos no parágrafo imediatamente anterior à tabela:

```markdown
[Quadro 1 - Parâmetros geométricos]

| Parâmetro | Valor | Unidade |
|---|---|---|
| Raio mínimo | 350 | m |
| Velocidade | 120 | km/h |
```

O texto entre parênteses rectos é convertido num elemento HTML `caption`, associado à tabela.

A linha do título deve:

- conter apenas o texto entre `[` e `]`;
- estar imediatamente antes da tabela;
- não conter outros parênteses rectos.

## Instalação manual

1. Abra a pasta `.obsidian/plugins/` do cofre do Obsidian.
2. Crie uma pasta denominada `simple-sener-plugins`.
3. Copie para essa pasta os ficheiros `main.js`, `manifest.json` e `styles.css`.
4. No Obsidian, abra **Definições → Plugins da comunidade**.
5. Active o plugin **Simple Table Merge**.
6. Se o plugin não aparecer ou já estava activo, reinicie o Obsidian ou recarregue os plugins.

Não são necessárias ferramentas de compilação nem dependências externas para esta versão.

## Limitações

- As funcionalidades são aplicadas no Modo de leitura.
- No modo de edição continuam visíveis os marcadores `->N`, `-^N` e `[Título da tabela]`.
- As uniões horizontal e vertical devem começar na primeira célula da área a unir.
- As células abrangidas pela união devem estar vazias.
- Combinações complexas de uniões horizontais e verticais na mesma zona da tabela poderão necessitar de testes adicionais.
- As legendas das imagens são tratadas como texto simples.
- Qualquer imagem com texto alternativo será considerada uma imagem com legenda.
