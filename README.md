# MTRREAL — Site Oficial

Site completo em HTML, CSS e JavaScript puro (sem frameworks, sem backend).
Funciona direto no VS Code e está pronto para publicar no Netlify.

```
MTRREAL/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── logo/
    │   ├── mtrreal-emblem.png     ← seu emblema (já incluído)
    │   └── mtrreal-wordmark.png   ← seu logotipo MTRREAL (já incluído)
    ├── data/
    │   └── products.js            ← ÚNICO arquivo para editar o catálogo
    ├── camisetas/
    ├── camisas/
    ├── conjuntos/
    ├── moletons/
    ├── shorts/
    ├── calcas/
    └── icons/
```

As duas logos que você enviou já estão dentro de `assets/logo/`, aplicadas
na navegação, na home e no rodapé. Quando tiver as fotos das roupas, me
envie que eu já preparo os produtos com elas.

---

## 1. Como abrir o projeto

1. Abra a pasta `MTRREAL` no VS Code.
2. Instale a extensão **Live Server** (opcional, mas recomendado).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
   - Também funciona abrindo o `index.html` direto no navegador (duplo clique),
     sem precisar de servidor.

---

## 2. Como colocar as fotos reais das roupas

Cada categoria tem sua própria pasta dentro de `assets/`:

```
assets/camisetas/
assets/moletons/
assets/shorts/
assets/calcas/
```

Para cada peça, salve 3 fotos com esse padrão de nome:

```
<nome-da-peca>-front.jpg   → foto de frente
<nome-da-peca>-back.jpg    → foto de costas
<nome-da-peca>-detail.jpg  → foto de detalhe/tecido
```

Exemplo, para a `MTRREAL TEE 001`:
```
assets/camisetas/tee-001-front.jpg
assets/camisetas/tee-001-back.jpg
assets/camisetas/tee-001-detail.jpg
```

Enquanto a foto não existir, o site mostra automaticamente um placeholder
discreto ("MTRREAL — foto em breve") no lugar dela. Ou seja: **você pode
publicar o site antes mesmo de ter todas as fotos prontas.**

Recomendações:
- Formato `.jpg`, fundo neutro ou still de still-life, resolução mínima 1600px
  no lado maior.
- Comprima as imagens antes (ex: [squoosh.app](https://squoosh.app)) para o
  site carregar rápido.

---

## 3. Como adicionar uma peça nova

Abra `assets/data/products.js`. Esse é o **único arquivo que você precisa
mexer** para o catálogo.

Copie um bloco existente e cole no final da lista `products`, dentro dos
colchetes `[ ... ]`, mudando os valores:

```js
{
  id: "tee-003",                      // único, sem espaços
  name: "MTRREAL TEE 003",
  category: "camisetas",              // camisetas | moletons | shorts | calcas
  price: 199.90,
  images: {
    front:  "assets/camisetas/tee-003-front.jpg",
    back:   "assets/camisetas/tee-003-back.jpg",
    detail: "assets/camisetas/tee-003-detail.jpg"
  },
  sizes: ["P", "M", "G", "GG"],
  soldOut: [],                        // ex: ["P","GG"] se esgotar tamanho
  description: "Descrição curta da peça.",
  fabric: "100% algodão penteado, 220g/m²",
  construction: "Detalhes de acabamento e costura",
  newDrop: false                      // true = aparece em destaque na home
}
```

Não esqueça da vírgula `,` entre um produto e outro na lista.

---

## 4. Como alterar preços

No mesmo arquivo `assets/data/products.js`, encontre a peça pelo `name` e
altere o valor de `price`. Use ponto, não vírgula:

```js
price: 219.90,
```

---

## 5. Como trocar o número de WhatsApp

Abra `script.js` e edite a linha no topo do arquivo:

```js
const WHATSAPP_NUMBER = "5544988045611"; // só dígitos
```

Formato: código do país (55) + DDD + número, só números, sem espaços,
traços ou parênteses.

Exemplo para um número de Maringá/PR (44) 9XXXX-XXXX:
```js
const WHATSAPP_NUMBER = "5544912345678";
```

---

## 6. Como ativar o "NEW DROP" em outra peça

No `products.js`, mude `newDrop: true` na peça que deve aparecer em
destaque na home, e `newDrop: false` nas demais (o site sempre mostra
apenas a primeira peça marcada como `true`).

---

## 7. Como publicar no Netlify

**Opção mais simples — arrastar e soltar:**
1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste a pasta `MTRREAL` inteira para a página.
3. Pronto — o Netlify gera um link público (`algumacoisa.netlify.app`).
4. Em **Site settings → Change site name**, você pode escolher um nome
   personalizado (ex: `mtrreal.netlify.app`).
5. Em **Domain settings**, dá pra ligar um domínio próprio como
   `mtrreal.com.br`, se você já tiver comprado um.

**Opção via GitHub (recomendada a longo prazo):**
1. Suba a pasta `MTRREAL` para um repositório no GitHub.
2. No Netlify, clique em **Add new site → Import an existing project**.
3. Conecte o repositório. Não é necessário configurar build command nem
   diretório de build — é um site estático puro.
4. A cada alteração que você enviar (`git push`), o Netlify atualiza o
   site sozinho.

---

## 8. O que já está pronto

- Home com espaço em branco generoso e emblema MTRREAL interativo
  (gira com o mouse no desktop e com o toque/swipe no celular, desacelerando
  sozinho ao soltar).
- Seção NEW DROP com a peça em destaque.
- 4 categorias (Camisetas, Moletons, Shorts, Calças) em grid editorial,
  com tamanhos variados de imagem — não é um grid de cards genérico.
- Página/overlay de produto com galeria (setas no desktop, swipe no
  celular), seleção de tamanho, descrição, tecido e construção.
- Botão **"QUERO ESTA PEÇA"** que abre o WhatsApp com a mensagem já
  preenchida com o nome da peça e o tamanho escolhido.
- Carrinho funcional (adicionar, aumentar/diminuir quantidade, remover,
  subtotal), que continua com os itens mesmo se a pessoa fechar e voltar
  ao site (fica salvo no navegador dela).
- Botão **"Finalizar no WhatsApp"** no carrinho, que monta uma mensagem
  com todos os itens do pedido.
- Menu mobile próprio (não é o menu do desktop encolhido).
- Todas as animações respeitam a preferência do sistema
  `prefers-reduced-motion` (quem desativa animação no celular/computador
  não vê nenhuma).
- Placeholders discretos onde ainda não existem fotos reais.

## 9. O que falta pra você

- Colocar as fotos reais das peças (item 2 acima).
- Trocar o número de WhatsApp (item 5).
- Revisar nomes, descrições, preços e tecidos de cada peça.

## 10. Coleções e prateleiras (novidades do site)

- **Prateleiras** na home (CAMISAS, SHORTS, MOLETONS, CALÇAS): use
  `shelf: "prateleira-moletons"` (ou `-camisas`, `-shorts`, `-calcas`) na peça.
  Cada peça substitui um card "Produto em breve" (sempre 4 cards no mínimo).
- **COLEÇÕES** (menu no topo): use `collection: "camisas-novidades"` na peça.
  Abas: conjuntos | camisas | moletons | shorts | calcas.
  Sub-abas: novidades | mais-vendidos | promocoes.
- O número de WhatsApp é limpo automaticamente (aceita espaços e traços), mas o
  ideal é deixar só dígitos.
