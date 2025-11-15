// assets/js/data/menuData.js
// Cardápio completo: buffets, travessas e experiências.

export const menuItems = [
  {
    id: "buffet-almoco-familia",
    name: "Buffet almoço de família",
    section: "Buffets quentes",
    buffetType: "Buffet quente",
    serves: "Serve de 10 a 15 pessoas",
    description:
      "Um almoço completo para reunir a família, com comida farta, apresentação caprichada e aquele tempero de domingo na casa da mãe.",
    details: [
      "Arroz branco soltinho",
      "Feijão cremoso com caldo encorpado",
      "Carne ao molho ou assada",
      "Frango assado dourado ou grelhado",
      "Duas opções de saladas frescas",
      "Farofa amanteigada ou purê cremoso",
    ],
    referencePrice: 680,
    displayPrice: "R$ 680,00 (referência para 12 pessoas)",
    note: "Valor referência · ajustado conforme número de convidados e composição do buffet.",
    config: {
      baseGuests: 12,
      quickModeLabel: "Almoço de família clássico da Tia Jane",
      optionGroups: [
        {
          id: "proteina",
          label: "Prato principal",
          type: "single",
          pricing: {
            baseCount: 1,
            extraPerOptionPercent: 40,
          },
          options: [
            {
              id: "carne-molho",
              label: "Carne ao molho",
              costCategory: "medium",
            },
            {
              id: "carne-assada",
              label: "Carne assada",
              costCategory: "high",
            },
            {
              id: "franco-assado",
              label: "Frango assado",
              costCategory: "medium",
            },
            {
              id: "frango-grelhado",
              label: "Frango grelhado",
              costCategory: "low",
            },
          ],
          default: "carne-assada",
        },
        {
          id: "acompanhamentos",
          label: "Acompanhamentos principais",
          type: "multi",
          pricing: {
            // 2 acompanhamentos inclusos na referência
            baseCount: 2,
            // cada acompanhamento extra encarece ~20%
            extraPerOptionPercent: 20,
          },
          options: [
            {
              id: "arroz-branco",
              label: "Arroz branco soltinho",
              costCategory: "low",
            },
            {
              id: "feijao-cremoso",
              label: "Feijão cremoso",
              costCategory: "medium",
            },
            {
              id: "farofa-amanteigada",
              label: "Farofa amanteigada",
              costCategory: "medium",
            },
            {
              id: "pure-cremoso",
              label: "Purê cremoso",
              costCategory: "high",
            },
          ],
          default: ["arroz-branco", "feijao-cremoso"],
        },
        {
          id: "saladas",
          label: "Saladas",
          type: "multi",
          pricing: {
            baseCount: 2,
            extraPerOptionPercent: 10,
          },
          options: [
            {
              id: "salada-verde",
              label: "Salada verde",
              costCategory: "low",
            },
            {
              id: "salada-colorida",
              label: "Salada colorida",
              costCategory: "medium",
            },
          ],
          default: ["salada-verde", "salada-colorida"],
        },
      ],
    },
  },
  {
    id: "buffet-noite-massas",
    name: "Buffet noite de massas",
    section: "Buffets quentes",
    buffetType: "Buffet quente",
    serves: "Serve de 15 a 20 pessoas",
    description:
      "Uma noite aconchegante com massas variadas, molhos artesanais e mesa montada para impressionar sem perder o clima de casa.",
    details: [
      "Duas opções de massa (ex.: penne, talharim, rondelli)",
      "Dois molhos artesanais (ex.: bolonhesa, branco, quatro queijos)",
      "Queijos ralados e finalizações",
      "Pães especiais e torradas temperadas",
      "Salada verde com legumes e vinagrete suave",
    ],
    referencePrice: 720,
    displayPrice: "R$ 720,00 (referência para 18 pessoas)",
    note: "Pode incluir opções vegetarianas e ajustes no cardápio.",
    config: {
      baseGuests: 18,
      quickModeLabel: "Noite de massas da Tia Jane",
      optionGroups: [
        {
          id: "massas",
          label: "Massas",
          type: "multi",
          pricing: {
            baseCount: 2,
            extraPerOptionPercent: 20,
          },
          options: [
            { id: "penne", label: "Penne", costCategory: "medium" },
            { id: "talharim", label: "Talharim", costCategory: "medium" },
            { id: "rondelli", label: "Rondelli", costCategory: "high" },
          ],
          default: ["penne", "rondelli"],
        },
        {
          id: "molhos",
          label: "Molhos",
          type: "multi",
          pricing: {
            baseCount: 2,
            extraPerOptionPercent: 20,
          },
          options: [
            { id: "bolonhesa", label: "Bolonhesa", costCategory: "medium" },
            { id: "branco", label: "Molho branco", costCategory: "medium" },
            {
              id: "quatro-queijos",
              label: "Quatro queijos",
              costCategory: "high",
            },
          ],
          default: ["bolonhesa", "quatro-queijos"],
        },
        {
          id: "extras",
          label: "Extras",
          type: "multi",
          pricing: {
            baseCount: 1,
            extraPerOptionPercent: 15,
          },
          options: [
            {
              id: "pao-especial",
              label: "Pães especiais",
              costCategory: "medium",
            },
            {
              id: "salada-verde",
              label: "Salada verde",
              costCategory: "low",
            },
          ],
          default: ["pao-especial", "salada-verde"],
        },
      ],
    },
  },
  {
    id: "mesa-saladas-entradas",
    name: "Mesa de saladas & entradas",
    section: "Buffets frios",
    buffetType: "Buffet frio",
    serves: "Serve de 20 a 25 pessoas",
    description:
      "Uma mesa colorida e fresca para receber os convidados com leveza, ideal para complementar buffets quentes ou eventos ao ar livre.",
    details: [
      "Salada verde com folhas selecionadas",
      "Legumes grelhados ou cozidos al dente",
      "Grãos (ex.: grão-de-bico, lentilha ou mix de grãos)",
      "Queijos, frutas secas e castanhas (a combinar)",
      "Molhos da casa em potinhos individuais ou molheiras",
    ],
    referencePrice: 350,
    displayPrice: "R$ 350,00 (referência de mesa completa)",
    note: "Perfeito para combinar com buffets quentes ou menus leves.",
    config: {
      baseGuests: 22,
      quickModeLabel: "Mesa fresca da Tia Jane",
      optionGroups: [
        {
          id: "saladas",
          label: "Saladas principais",
          type: "multi",
          pricing: {
            baseCount: 2,
            extraPerOptionPercent: 15,
          },
          options: [
            {
              id: "salada-verde",
              label: "Salada verde",
              costCategory: "low",
            },
            {
              id: "salada-mista",
              label: "Salada mista colorida",
              costCategory: "medium",
            },
          ],
          default: ["salada-verde", "salada-mista"],
        },
        {
          id: "graos",
          label: "Grãos",
          type: "single",
          pricing: {
            baseCount: 1,
            extraPerOptionPercent: 20,
          },
          options: [
            {
              id: "grao-bico",
              label: "Grão-de-bico",
              costCategory: "medium",
            },
            { id: "lentilha", label: "Lentilha", costCategory: "medium" },
            {
              id: "mix-graos",
              label: "Mix de grãos",
              costCategory: "high",
            },
          ],
          default: "mix-graos",
        },
        {
          id: "finalizacao",
          label: "Toque final",
          type: "multi",
          pricing: {
            baseCount: 1,
            extraPerOptionPercent: 20,
          },
          options: [
            { id: "queijos", label: "Queijos", costCategory: "high" },
            { id: "castanhas", label: "Castanhas", costCategory: "high" },
            {
              id: "frutas-secas",
              label: "Frutas secas",
              costCategory: "medium",
            },
          ],
          default: ["queijos", "castanhas"],
        },
      ],
    },
  },
  {
    id: "mesa-sobremesas-afetivas",
    name: "Mesa de sobremesas afetivas",
    section: "Sobremesas & mesa doce",
    buffetType: "Buffet frio",
    serves: "Serve de 20 a 30 pessoas",
    description:
      "Uma seleção de doces de infância com apresentação delicada, unindo lembrança afetiva e cuidado estético.",
    details: [
      "Pudim de leite condensado com calda generosa",
      "Pavê cremoso (sabores a combinar)",
      "Mousses em taças ou copinhos",
      "Doces de colher e opções em travessa",
      "Detalhes decorativos na mesa (toalhas, suportes, alturas)",
    ],
    referencePrice: 420,
    displayPrice: "R$ 420,00 (mesa referência)",
    note: "Sabores e combinações ajustados ao perfil do evento.",
    config: {
      baseGuests: 25,
      quickModeLabel: "Mesa doce afetiva da Tia Jane",
      optionGroups: [
        {
          id: "sobremesas",
          label: "Sobremesas principais",
          type: "multi",
          pricing: {
            baseCount: 3,
            extraPerOptionPercent: 20,
          },
          options: [
            { id: "pudim", label: "Pudim de leite", costCategory: "medium" },
            { id: "pave", label: "Pavê cremoso", costCategory: "medium" },
            {
              id: "mousse",
              label: "Mousses em taça",
              costCategory: "high",
            },
          ],
          default: ["pudim", "pave", "mousse"],
        },
        {
          id: "decoracao",
          label: "Decoração",
          type: "multi",
          pricing: {
            baseCount: 1,
            extraPerOptionPercent: 15,
          },
          options: [
            {
              id: "toalhas",
              label: "Toalhas especiais",
              costCategory: "medium",
            },
            {
              id: "suportes-alturas",
              label: "Suportes e alturas",
              costCategory: "high",
            },
          ],
          default: ["toalhas", "suportes-alturas"],
        },
      ],
    },
  },
  {
    id: "jantar-intimista-dois",
    name: "Jantar intimista a dois",
    section: "Experiências intimistas",
    buffetType: "Experiência intimista",
    serves: "Menu completo para 2 pessoas",
    description:
      "Uma experiência pensada para momentos especiais: clima aconchegante, comida bem apresentada e sensação de cuidado em cada detalhe.",
    details: [
      "Entrada leve (ex.: salada ou creme)",
      "Prato principal a combinar (massa, carne ou frango)",
      "Guarnição harmonizada",
      "Sobremesa afetiva para compartilhar",
      "Montagem e orientações de apresentação",
    ],
    referencePrice: 260,
    displayPrice: "R$ 260,00 (menu referência)",
    note: "Menu totalmente ajustável ao gosto do casal.",
    config: {
      baseGuests: 2,
      quickModeLabel: "Jantar romântico da Tia Jane",
      optionGroups: [
        {
          id: "principal",
          label: "Prato principal",
          type: "single",
          pricing: {
            baseCount: 1,
            extraPerOptionPercent: 40,
          },
          options: [
            { id: "massa", label: "Massa especial", costCategory: "medium" },
            { id: "carne", label: "Carne", costCategory: "high" },
            { id: "frango", label: "Frango", costCategory: "medium" },
          ],
          default: "massa",
        },
        {
          id: "sobremesa",
          label: "Sobremesa",
          type: "single",
          pricing: {
            baseCount: 1,
            extraPerOptionPercent: 30,
          },
          options: [
            {
              id: "afeto",
              label: "Sobremesa afetiva da casa",
              costCategory: "medium",
            },
            {
              id: "chocolate",
              label: "Toque de chocolate",
              costCategory: "high",
            },
          ],
          default: "afeto",
        },
      ],
    },
  },
  {
    id: "monte-seu-buffet",
    name: "Monte o seu buffet",
    section: "Buffets personalizados",
    buffetType: "Buffet personalizado",
    serves: "Sob medida para o seu evento",
    description:
      "Um serviço pensado para quem quer misturar pratos do site e criar um cardápio único junto com a Tia Jane.",
    details: [
      "Escolha até 2 pratos principais (ex.: strogonoff, carnes assadas, massas)",
      "Combine guarnições (arroz, saladas, farofas, purês, etc.)",
      "Possibilidade de incluir mesa de saladas ou sobremesas",
      "Ajuste fino de quantidade conforme número de convidados",
      "Planejamento do serviço em conjunto pelo WhatsApp",
    ],
    referencePrice: 1300, // ~20 pessoas a ~R$ 65/pessoa
    displayPrice: "A partir de R$ 65,00 por pessoa",
    note: "Valor final definido em conjunto, conforme escolhas e quantidade.",
    config: {
      baseGuests: 20,
      quickModeLabel: "Buffet montado pela Tia Jane",
      optionGroups: [
        {
          id: "principais",
          label: "Pratos principais",
          type: "multi",
          pricing: {
            baseCount: 2,
            extraPerOptionPercent: 35,
          },
          options: [
            {
              id: "strogonoff",
              label: "Strogonoff",
              costCategory: "medium",
            },
            {
              id: "carne-assada",
              label: "Carne assada",
              costCategory: "high",
            },
            { id: "massa", label: "Alguma massa da casa", costCategory: "low" },
          ],
          default: ["strogonoff", "carne-assada"],
        },
        {
          id: "guarnicoes",
          label: "Guarnições",
          type: "multi",
          pricing: {
            baseCount: 2,
            extraPerOptionPercent: 20,
          },
          options: [
            { id: "arroz", label: "Arroz", costCategory: "low" },
            {
              id: "saladas",
              label: "Saladas variadas",
              costCategory: "medium",
            },
            { id: "farofa", label: "Farofa", costCategory: "medium" },
            { id: "pure", label: "Purê", costCategory: "medium" },
          ],
          default: ["arroz", "saladas", "farofa"],
        },
      ],
    },
  },
];
