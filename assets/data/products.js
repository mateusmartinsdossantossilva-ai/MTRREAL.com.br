/* =========================================================================
   MTRREAL — CATÁLOGO DE PRODUTOS
   =========================================================================
   Este é o ÚNICO arquivo que você precisa editar para:
   - adicionar peças novas
   - mudar preços
   - trocar fotos
   - ativar/desativar o "NEW DROP"

   Basta duplicar um objeto dentro de `products` e alterar os valores.
   Não é necessário tocar em index.html, style.css ou script.js.

   CAMPOS:
   id          -> identificador único (sem espaços)
   name        -> nome da peça, ex: "MTRREAL TEE 001"
   category    -> "camisetas" | "moletons" | "camisas"
   price       -> número, em reais, sem "R$" (ex: 129.90)
   images      -> caminhos das fotos dentro de assets/<categoria>/
                  front = frente | back = costas | detail = detalhe
   sizes       -> lista de tamanhos disponíveis, ex: ["P","M","G","GG"]
   soldOut     -> lista de tamanhos esgotados (pode ficar vazia: [])
   description -> descrição curta da peça
   fabric      -> composição do tecido
   construction-> informações de construção/acabamento
   newDrop     -> true = aparece na seção NEW DROP da home
   collection  -> (opcional) coloca a peça SÓ numa sub-aba de COLEÇÕES,
                  no formato "<aba>-<sub-aba>":
                  abas:     camisas | moletons
                  sub-abas: novidades | mais-vendidos | promocoes
                  ex: collection: "camisas-novidades"
                  (peças com `collection` não aparecem nas categorias antigas)
   shelf       -> (opcional) coloca a peça SÓ numa prateleira da página inicial:
                  prateleira-camisas | prateleira-moletons
                  ex: shelf: "prateleira-moletons"
                  (cada peça substitui um card "Produto em breve")
   ========================================================================= */

const products = [
  {
    id: "tee-001",
    name: "MTRREAL TEE 001",
    category: "camisetas",
    price: 130.00,
    images: {
      front: "assets/camisetas/tee-001-front.jpg",
      back: "assets/camisetas/tee-001-back.jpg",
      detail: "assets/camisetas/tee-001-detail.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Camiseta de corte reto com caimento estruturado. Peça base da MTRREAL, pensada para uso diário sem perder presença.",
    fabric: "100% algodão penteado 30.1, 220g/m²",
    construction: "Costura reforçada dupla agulha, gola canelada anti-deformação",
    newDrop: true
  },
  {
    id: "tee-002",
    name: "MTRREAL TEE 002",
    category: "camisetas",
    price: 80.00,
    images: {
      front: "assets/camisetas/tee-002-front.jpg",
      back: "assets/camisetas/tee-002-back.jpg",
      detail: "assets/camisetas/tee-002-detail.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: ["P"],
    description:
      "Corte oversized com ombro caído. Silhueta ampla mantendo estrutura no tecido.",
    fabric: "100% algodão penteado 30.1, 240g/m²",
    construction: "Bainha dupla, etiqueta emborrachada lateral",
    newDrop: false
  },
  {
    id: "moleton-001",
    name: "MTRREAL HOODIE 001",
    category: "moletons",
    price: 200.90,
    images: {
      front: "assets/moletons/hoodie-001-front.jpg",
      back: "assets/moletons/hoodie-001-back.jpg",
      detail: "assets/moletons/hoodie-001-detail.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Moletom com capuz forrado e bolso canguru. Peça central da coleção, feita para durar temporadas.",
    fabric: "Moletom flanelado 400g/m², 80% algodão / 20% poliéster",
    construction: "Cordão com ponteira emborrachada, punho e barra em ribana reforçada",
    newDrop: true
  },
  {
    id: "hoodie-signature",
    name: "MTRREAL SIGNATURE",
    category: "moletons",
    price: 300.00,
    images: {
      front: "assets/moletons/hoodie-signature-front.jpg",
      back: "assets/moletons/hoodie-signature-back.jpg"
    },
    sizes: ["M", "G", "GG"],
    soldOut: [],
    description:
      "Moletom preto com capuz e bolso canguru. Escudo MTR grande em branco no peito.",
    fabric: "",
    construction: "",
    newDrop: false
  },
  {
    id: "hoodie-one-of-one",
    name: "MTRREAL HOODIE ONE OF ONE",
    category: "moletons",
    price: 270.00,
    images: {
      front: "assets/moletons/hoodie-one-of-one-front.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Moletom preto com capuz e bolso canguru. Escrita “ONE OF ONE” pequena no peito.",
    fabric: "",
    construction: "",
    newDrop: false,
    shelf: "prateleira-moletons",
    collection: "moletons-novidades"
  },
  {
    id: "hoodie-core",
    name: "MTRREAL HOODIE CORE",
    category: "moletons",
    price: 270.00,
    images: {
      front: "assets/moletons/hoodie-core-front.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Moletom preto com capuz. “MTRREAL” grande em cinza no peito e logo oval pequeno.",
    fabric: "",
    construction: "",
    newDrop: false,
    shelf: "prateleira-moletons",
    collection: "moletons-novidades"
  },
  {
    id: "hoodie-oval",
    name: "MTRREAL HOODIE OVAL",
    category: "moletons",
    price: 270.00,
    images: {
      front: "assets/moletons/hoodie-oval-front.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Moletom preto com capuz e logo oval MTRREAL em cinza no peito.",
    fabric: "",
    construction: "",
    newDrop: false,
    shelf: "prateleira-moletons",
    collection: "moletons-novidades"
  },
  {
    id: "hoodie-triple-oval",
    name: "MTRREAL HOODIE TRIPLE OVAL",
    category: "moletons",
    price: 270.00,
    images: {
      front: "assets/moletons/hoodie-triple-oval-front.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Moletom preto com capuz e três logos ovais MTRREAL empilhados no peito.",
    fabric: "",
    construction: "",
    newDrop: false,
    shelf: "prateleira-moletons",
    collection: "moletons-novidades"
  },
  {
    id: "hoodie-crest",
    name: "MTRREAL HOODIE CREST",
    category: "moletons",
    price: 300.00,
    images: {
      front: "assets/moletons/hoodie-crest-front.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Moletom preto com capuz e escudo MTR em branco no peito.",
    fabric: "",
    construction: "",
    newDrop: false,
    shelf: "prateleira-moletons",
    collection: "moletons-novidades"
  },
  {
    id: "tee-mtr",
    name: "MTRREAL TEE MTR",
    category: "camisas",
    price: 159.90,
    images: {
      front: "assets/camisas/tee-mtr-front.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Camiseta preta com “MTR” gigante em branco na frente.",
    fabric: "",
    construction: "",
    newDrop: false,
    shelf: "prateleira-camisas",
    collection: "camisas-novidades"
  },
  {
    id: "tee-oval-fog",
    name: "MTRREAL TEE OVAL FEAR OF GOD",
    category: "camisas",
    price: 159.90,
    images: {
      front: "assets/camisas/tee-oval-fog-front.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Camiseta preta com logo oval MTRREAL e “FEAR OF GOD” no peito.",
    fabric: "",
    construction: "",
    newDrop: false,
    shelf: "prateleira-camisas",
    collection: "camisas-novidades"
  },
  {
    id: "tee-core-fog",
    name: "MTRREAL TEE CORE FEAR OF GOD",
    category: "camisas",
    price: 159.90,
    images: {
      front: "assets/camisas/tee-core-fog-front.jpg"
    },
    sizes: ["P", "M", "G", "GG"],
    soldOut: [],
    description:
      "Camiseta preta com “MTRREAL” em cinza e “FEAR OF GOD” no peito.",
    fabric: "",
    construction: "",
    newDrop: false,
    shelf: "prateleira-camisas",
    collection: "camisas-novidades"
  }
];
