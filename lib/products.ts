import { cloudinaryImage } from './cloudinary-assets'

export type ProductVariant = {
  color?: string
  size?: string
}

export type Product = {
  slug: string
  name: string
  category: string
  shortDescription?: string
  description?: string
  fabric?: string
  colors?: string[]
  sizes?: string[]
  product?: string
  model?: string
  gallery?: string[]
  variants?: ProductVariant[]
  isActive?: boolean
}

export type CatalogGroupType = 'collection' | 'category' | 'aggregate'

export type CatalogGroup = {
  slug: string
  name: string
  type: CatalogGroupType
  description?: string
  productSlugs?: string[]
}

export const catalogGroups: CatalogGroup[] = [
  {
    slug: 'sagi-vitta',
    name: 'SAGI - VITTA',
    type: 'collection',
    description:
      'SAGI - VITTA reúne piezas de presencia serena y contemporánea, pensadas para explorar una identidad femenina clara, versátil y cercana.',
    productSlugs: ['blusa-vitta', 'falda-dolce-vitta', 'jean-vitta'],
  },
  {
    slug: 'swimwear',
    name: 'SWIMWEAR',
    type: 'category',
    description:
      'Swimwear agrupa piezas de baño y complementos para momentos de sol, descanso y movimiento, con una lectura fresca del universo ISOLÉ.',
    productSlugs: ['enterizo-noir', 'bikini-atardecer', 'tiara-marfil'],
  },
  {
    slug: 'georgiana',
    name: 'GEORGIANA',
    type: 'collection',
    description:
      'GEORGIANA propone una mirada expresiva y segura del vestir, con prendas que funcionan como acentos de estilo dentro del catálogo.',
    productSlugs: [
      'cinturilla-georgiana',
      'vestido-duquesa',
      'vestido-encanto-azul',
    ],
  },
  {
    slug: 'cayena',
    name: 'CAYENA',
    type: 'collection',
    description:
      'CAYENA articula piezas cálidas y decididas, creadas para acompañar combinaciones con intención sin perder naturalidad.',
    productSlugs: ['vestido-cayena', 'maxi-jean-cayena', 'vestido-mono-blanco'],
  },
  {
    slug: 'vestidos',
    name: 'VESTIDOS',
    type: 'category',
    description:
      'Vestidos reúne propuestas para llevar como protagonistas del look, desde opciones de espíritu cotidiano hasta piezas con una presencia más marcada.',
    productSlugs: ['vestido-tropical', 'vestido-floral-negro', 'vestido-cereza'],
  },
  {
    slug: 'prendas-superiores',
    name: 'PRENDAS SUPERIORES',
    type: 'category',
    description:
      'Prendas superiores organiza blusas, corsets y tops para construir combinaciones con capas, contraste y una lectura personal del estilo.',
    productSlugs: ['blusa-tiras-blanca', 'corset-blonda', 'top-brillos-negro'],
  },
  {
    slug: 'prendas-inferiores',
    name: 'PRENDAS INFERIORES',
    type: 'category',
    description:
      'Prendas inferiores agrupa faldas, pantalones y jeans pensados para sostener el look desde la forma, el color y la composición.',
    productSlugs: ['falda-blanca-denim', 'pantalon-christina', 'falda-love'],
  },
  {
    slug: 'jeans',
    name: 'JEANS',
    type: 'category',
    description:
      'Jeans reúne piezas de espíritu versátil para acompañar el día a día y dialogar con prendas superiores de distintas colecciones.',
    productSlugs: ['jean-wide-leg-clasico'],
  },
  {
    slug: 'camisetas',
    name: 'CAMISETAS',
    type: 'category',
    description:
      'Camisetas presenta piezas de lectura cómoda y directa, pensadas para integrarse con facilidad a combinaciones cotidianas.',
    productSlugs: ['camiseta-unisex-criollitos'],
  },
  {
    slug: 'unique',
    name: 'UNIQUE',
    type: 'collection',
    description:
      'UNIQUE reúne prendas de intención limpia y expresiva, concebidas para habitar el clóset con presencia propia y combinaciones sencillas.',
    productSlugs: ['pantalon-marfil', 'blusa-marfil', 'vestido-primaveral-corto'],
  },
  {
    slug: 'celestial',
    name: 'CELESTIAL',
    type: 'collection',
    description:
      'CELESTIAL propone piezas de carácter delicado y afirmativo, conectadas con una idea de luz interior y expresión personal.',
    productSlugs: ['corset-celestial', 'falda-celestial'],
  },
  {
    slug: 'todos-los-articulos',
    name: 'TODOS LOS ARTÍCULOS',
    type: 'aggregate',
    description:
      'Una vista dinámica de todas las piezas activas del catálogo, organizada para explorar el universo ISOLÉ sin duplicar productos.',
  },
]

export const products: Product[] = [
  {
    slug: 'vestido-atardecer',
    name: 'Vestido Atardecer',
    category: 'Vestidos',
    shortDescription:
      'Vestido en tonos cálidos para llevar como pieza principal en días de luz, descanso y movimiento.',
    description:
      'Vestido Atardecer concentra la energía cálida de la colección en una pieza de lectura romántica y natural. Funciona como protagonista del look y puede acompañarse con accesorios discretos o prendas neutras. Su paleta coral y nude dialoga con el universo de luz interior de ISOLÉ sin recurrir a exageraciones ni promesas técnicas.',
    fabric: 'Lino 100% natural',
    colors: ['Atardecer Coral', 'Nude'],
    product: cloudinaryImage('/images/arrival-1-product.png'),
    model: cloudinaryImage('/images/arrival-1-model.png'),
    gallery: [
      cloudinaryImage('/images/arrival-1-model.png'),
      cloudinaryImage('/images/detail-back.png'),
      cloudinaryImage('/images/detail-texture.png'),
      cloudinaryImage('/images/detail-lifestyle.png'),
    ],
  },
  {
    slug: 'blusa-seda-alba',
    name: 'Blusa Seda Alba',
    category: 'Blusas',
    shortDescription:
      'Blusa de lectura suave y luminosa para combinar con faldas, pantalones o jeans del catálogo.',
    description:
      'Blusa Seda Alba propone una presencia tranquila dentro del clóset: clara, femenina y fácil de integrar a distintas combinaciones. Puede funcionar como base de un look sereno o como contraste para piezas de color más expresivo. Su nombre y paleta evocan una idea de calma sin afirmar características técnicas no documentadas.',
    fabric: 'Seda lavada',
    colors: ['Crema', 'Pétalo Rosa'],
    product: cloudinaryImage('/images/arrival-2-product.png'),
    model: cloudinaryImage('/images/arrival-2-model.png'),
    gallery: [
      cloudinaryImage('/images/arrival-2-model.png'),
      cloudinaryImage('/images/arrival-2-product.png'),
      cloudinaryImage('/images/editorial-story.png'),
    ],
  },
  {
    slug: 'slip-petalo',
    name: 'Slip Pétalo',
    category: 'Vestidos',
    shortDescription:
      'Vestido slip en tono pétalo para looks de espíritu delicado, expresivo y contemporáneo.',
    description:
      'Slip Pétalo lleva el tono rosa de la marca a una pieza de intención sutil y memorable. Su lectura visual permite usarlo como punto central de una combinación o acompañarlo con capas ligeras y accesorios sobrios. Es una propuesta romántica sin exceso, alineada con una feminidad segura y contemporánea.',
    fabric: 'Satén de viscosa',
    colors: ['Pétalo Rosa', 'Lavanda Viva'],
    product: cloudinaryImage('/images/arrival-3-product.png'),
    model: cloudinaryImage('/images/arrival-3-model.png'),
    gallery: [
      cloudinaryImage('/images/arrival-3-model.png'),
      cloudinaryImage('/images/collection-3.png'),
      cloudinaryImage('/images/collection-4.png'),
    ],
  },
  {
    slug: 'blusa-vitta',
    name: 'BLUSA VITTA',
    category: 'SAGI - VITTA',
    shortDescription:
      'Blusa de la colección SAGI - VITTA para crear combinaciones serenas con identidad propia.',
    description:
      'BLUSA VITTA hace parte de SAGI - VITTA, una colección que conversa con la claridad y la presencia cotidiana. Es una pieza superior pensada para integrarse a distintos looks sin imponer una sola forma de uso. Su valor está en permitir combinaciones limpias, femeninas y actuales dentro del universo ISOLÉ.',
  },
  {
    slug: 'falda-dolce-vitta',
    name: 'FALDA DOLCE VITTA',
    category: 'SAGI - VITTA',
    shortDescription:
      'Falda de la colección SAGI - VITTA para acompañar looks con una lectura femenina y actual.',
    description:
      'FALDA DOLCE VITTA amplía la colección SAGI - VITTA con una pieza inferior de intención clara. Está pensada para combinarse con prendas superiores de la misma línea o con básicos del catálogo, manteniendo un lenguaje equilibrado. Su nombre aporta una nota expresiva sin necesidad de inventar detalles técnicos.',
  },
  {
    slug: 'jean-vitta',
    name: 'JEAN VITTA',
    category: 'SAGI - VITTA',
    shortDescription:
      'Jean de la colección SAGI - VITTA para combinar con piezas superiores del showroom.',
    description:
      'JEAN VITTA completa la lectura de SAGI - VITTA desde una prenda inferior versátil. Su lugar dentro del catálogo permite construir combinaciones relajadas o más compuestas, según la intención del look. Es una pieza pensada para acompañar, no para imponer, en coherencia con la voz cercana de ISOLÉ.',
  },
  {
    slug: 'enterizo-noir',
    name: 'ENTERIZO NOIR',
    category: 'SWIMWEAR',
    shortDescription:
      'Enterizo de baño en la categoría Swimwear, con una presencia sobria y fácil de reconocer.',
    description:
      'ENTERIZO NOIR forma parte de Swimwear, la categoría dedicada a momentos de sol, descanso y movimiento. Su nombre sugiere una propuesta visual sobria dentro del universo de la marca. Puede leerse como una pieza principal para la playa o la piscina, sin afirmar detalles de ajuste o soporte no registrados.',
  },
  {
    slug: 'bikini-atardecer',
    name: 'BIKINI ATARDECER',
    category: 'SWIMWEAR',
    shortDescription:
      'Bikini de espíritu cálido para explorar la categoría Swimwear desde la energía Atardecer.',
    description:
      'BIKINI ATARDECER lleva la sensibilidad cálida de ISOLÉ a la categoría Swimwear. Es una pieza pensada para momentos de verano y descanso, con un nombre que conecta con luz, color y expresión. La descripción se mantiene neutral porque no hay información técnica verificable sobre materiales, ajuste o soporte.',
  },
  {
    slug: 'tiara-marfil',
    name: 'TIARA MARFIL',
    category: 'SWIMWEAR',
    shortDescription:
      'Complemento de la categoría Swimwear para sumar un acento claro a combinaciones de verano.',
    description:
      'TIARA MARFIL funciona como un complemento dentro de Swimwear y aporta una nota luminosa al catálogo. Su nombre permite ubicarla como un acento de estilo sin atribuirle materiales o acabados no documentados. Es una pieza para completar combinaciones con una lectura delicada y cercana.',
  },
  {
    slug: 'cinturilla-georgiana',
    name: 'CINTURILLA GEORGIANA',
    category: 'GEORGIANA',
    shortDescription:
      'Pieza de la colección GEORGIANA para sumar un acento definido a distintas combinaciones.',
    description:
      'CINTURILLA GEORGIANA pertenece a una colección de carácter expresivo y seguro. Se presenta como una pieza de acento dentro del catálogo, útil para construir looks con mayor intención visual. La descripción evita asumir estructura, ajuste o materiales, y se concentra en su rol estilístico dentro de GEORGIANA.',
  },
  {
    slug: 'vestido-duquesa',
    name: 'VESTIDO DUQUESA',
    category: 'GEORGIANA',
    shortDescription:
      'Vestido de la colección GEORGIANA con una presencia femenina, expresiva y ceremonial.',
    description:
      'VESTIDO DUQUESA amplía el universo GEORGIANA con una pieza pensada para ocupar el centro del look. Su nombre comunica una presencia especial sin necesidad de prometer atributos técnicos. Puede acompañar momentos donde la prenda tenga protagonismo, manteniendo la mezcla de romanticismo y fuerza propia de ISOLÉ.',
  },
  {
    slug: 'vestido-encanto-azul',
    name: 'VESTIDO ENCANTO AZUL',
    category: 'GEORGIANA',
    shortDescription:
      'Vestido de la colección GEORGIANA con una identidad cromática clara y una intención expresiva.',
    description:
      'VESTIDO ENCANTO AZUL suma una lectura cromática distintiva a la colección GEORGIANA. Es una pieza para quienes buscan que el vestido sea el punto de partida del look, con un nombre que evoca presencia y emoción. No se agregan detalles de tela, largo o silueta porque no están documentados.',
  },
  {
    slug: 'vestido-cayena',
    name: 'VESTIDO CAYENA',
    category: 'CAYENA',
    shortDescription:
      'Vestido de la colección CAYENA para looks cálidos, presentes y fáciles de reconocer.',
    description:
      'VESTIDO CAYENA concentra el carácter de su colección en una pieza pensada para llevar como protagonista. Su nombre conecta con una energía cálida y decidida, alineada con la paleta emocional de ISOLÉ. La descripción se mantiene abierta para no inventar detalles de construcción o materialidad no registrados.',
  },
  {
    slug: 'maxi-jean-cayena',
    name: 'MAXI JEAN CAYENA',
    category: 'CAYENA',
    shortDescription:
      'Jean de la colección CAYENA para construir combinaciones con una base marcada y contemporánea.',
    description:
      'MAXI JEAN CAYENA aporta a la colección una prenda inferior de presencia clara. Su nombre permite imaginarlo como base de combinaciones con tops, blusas o piezas de color, sin necesidad de afirmar detalles técnicos. Es una propuesta para integrar el universo CAYENA a looks cotidianos o más expresivos.',
  },
  {
    slug: 'vestido-mono-blanco',
    name: 'VESTIDO MOÑO BLANCO',
    category: 'CAYENA',
    shortDescription:
      'Vestido de la colección CAYENA con una lectura clara, femenina y de intención delicada.',
    description:
      'VESTIDO MOÑO BLANCO hace parte de CAYENA y suma una pieza de nombre preciso dentro del catálogo. Puede funcionar como centro de una combinación suave o contrastarse con accesorios de mayor presencia. No se describen detalles de confección porque el repositorio no registra información técnica verificable.',
  },
  {
    slug: 'vestido-tropical',
    name: 'VESTIDO TROPICAL',
    category: 'VESTIDOS',
    shortDescription:
      'Vestido de la categoría Vestidos para looks de clima cálido y expresión natural.',
    description:
      'VESTIDO TROPICAL pertenece a la categoría Vestidos y propone una lectura fresca dentro del catálogo. Su nombre permite ubicarlo en momentos de luz, color y movimiento, sin afirmar materiales ni detalles de ajuste. Es una pieza pensada para explorar combinaciones con una energía cercana al verano.',
  },
  {
    slug: 'vestido-floral-negro',
    name: 'VESTIDO FLORAL NEGRO',
    category: 'VESTIDOS',
    shortDescription:
      'Vestido con identidad floral y base negra para una presencia visual definida.',
    description:
      'VESTIDO FLORAL NEGRO combina una referencia floral con una base cromática sobria desde su propio nombre. Dentro de la categoría Vestidos, funciona como una opción de mayor contraste visual. La descripción evita atribuir estampado, tela o largo más allá de lo indicado por la nomenclatura del producto.',
  },
  {
    slug: 'vestido-cereza',
    name: 'VESTIDO CEREZA',
    category: 'VESTIDOS',
    shortDescription:
      'Vestido de nombre vibrante para llevar color e intención al centro del look.',
    description:
      'VESTIDO CEREZA suma una nota intensa a la categoría Vestidos. Su nombre lo conecta con una energía expresiva y femenina, coherente con una marca que entiende la ropa como extensión de identidad. Puede combinarse con piezas neutras para darle protagonismo o con accesorios de lectura cálida.',
  },
  {
    slug: 'blusa-tiras-blanca',
    name: 'BLUSA TIRAS BLANCA',
    category: 'PRENDAS SUPERIORES',
    shortDescription:
      'Blusa blanca de tiras para combinaciones claras, frescas y fáciles de integrar.',
    description:
      'BLUSA TIRAS BLANCA pertenece a Prendas superiores y funciona como una pieza de lectura limpia dentro del catálogo. Su nombre permite reconocer color y tipo sin necesidad de añadir información técnica. Puede acompañar faldas, jeans o pantalones, manteniendo una presencia sencilla y femenina.',
  },
  {
    slug: 'corset-blonda',
    name: 'CORSET BLONDA',
    category: 'PRENDAS SUPERIORES',
    shortDescription:
      'Corset de la categoría Prendas superiores para looks con una intención más marcada.',
    description:
      'CORSET BLONDA suma una pieza superior de carácter definido al catálogo. Su nombre comunica una presencia especial, útil para construir combinaciones donde la parte superior tenga protagonismo. La descripción evita prometer soporte, ajuste o estructura porque esos datos no están registrados en la fuente actual.',
  },
  {
    slug: 'top-brillos-negro',
    name: 'TOP BRILLOS NEGRO',
    category: 'PRENDAS SUPERIORES',
    shortDescription:
      'Top negro con referencia de brillo para combinaciones nocturnas o de mayor contraste.',
    description:
      'TOP BRILLOS NEGRO pertenece a Prendas superiores y aporta una lectura visual más intensa desde su nombre. Puede funcionar como acento en looks sobrios o como pieza central en combinaciones expresivas. No se agregan detalles de material, textura o acabado más allá de la información disponible.',
  },
  {
    slug: 'falda-blanca-denim',
    name: 'FALDA BLANCA DENIM',
    category: 'PRENDAS INFERIORES',
    shortDescription:
      'Falda blanca denim para construir looks claros con una base cotidiana y actual.',
    description:
      'FALDA BLANCA DENIM integra Prendas inferiores con una lectura directa y fácil de combinar. Su nombre define el tipo de pieza y su identidad principal, por lo que el texto se concentra en su uso dentro del look. Puede dialogar con blusas, tops o camisetas del catálogo sin inventar detalles técnicos.',
  },
  {
    slug: 'pantalon-christina',
    name: 'PANTALÓN CHRISTINA',
    category: 'PRENDAS INFERIORES',
    shortDescription:
      'Pantalón disponible en Vino y Café para combinaciones cálidas, sobrias y expresivas.',
    description:
      'PANTALÓN CHRISTINA es una prenda inferior con variantes de color Vino y Café registradas en el catálogo. Su presencia permite construir looks cálidos y equilibrados, combinándolo con prendas superiores de intención clara. La descripción no asume fit, material ni estructura, y conserva únicamente los datos verificables.',
    colors: ['Vino', 'Café'],
    variants: [{ color: 'Vino' }, { color: 'Café' }],
  },
  {
    slug: 'falda-love',
    name: 'FALDA LOVE',
    category: 'PRENDAS INFERIORES',
    shortDescription:
      'Falda de nombre expresivo para looks femeninos con una lectura cercana y emocional.',
    description:
      'FALDA LOVE suma a Prendas inferiores una pieza de tono emocional y fácil de reconocer. Su nombre conversa con el arquetipo cercano de la marca, sin necesidad de prometer características no documentadas. Puede integrarse a combinaciones suaves o contrastarse con prendas superiores de mayor presencia.',
  },
  {
    slug: 'jean-wide-leg-clasico',
    name: 'JEAN WIDE LEG CLÁSICO',
    category: 'JEANS',
    shortDescription:
      'Jean wide leg clásico para combinaciones cotidianas con una base versátil.',
    description:
      'JEAN WIDE LEG CLÁSICO representa la categoría Jeans con una pieza de nombre claro y funcional. Puede acompañar blusas, camisetas o tops del catálogo, actuando como base para distintas lecturas de estilo. Se mantiene una descripción prudente, sin afirmar medidas, ajuste o composición no registradas.',
  },
  {
    slug: 'camiseta-unisex-criollitos',
    name: 'CAMISETA UNISEX CRIOLLITOS',
    category: 'CAMISETAS',
    shortDescription:
      'Camiseta unisex de lectura directa para looks cotidianos con identidad cercana.',
    description:
      'CAMISETA UNISEX CRIOLLITOS pertenece a la categoría Camisetas y aporta una propuesta cotidiana dentro del catálogo. Su nombre comunica una intención más directa y casual, pensada para combinarse con jeans, faldas o prendas inferiores. La descripción evita afirmar materiales o tallajes no documentados.',
  },
  {
    slug: 'pantalon-marfil',
    name: 'PANTALÓN MARFIL',
    category: 'UNIQUE',
    shortDescription:
      'Pantalón de la colección UNIQUE con una lectura clara, suave y combinable.',
    description:
      'PANTALÓN MARFIL hace parte de UNIQUE y aporta una base de color claro al catálogo. Puede integrarse con blusas, tops o piezas de contraste, manteniendo una presencia serena. La descripción se apoya en el nombre y la agrupación existente, sin atribuir materiales, fit o acabados no verificados.',
  },
  {
    slug: 'blusa-marfil',
    name: 'BLUSA MARFIL',
    category: 'UNIQUE',
    shortDescription:
      'Blusa de la colección UNIQUE para combinaciones luminosas y de intención sencilla.',
    description:
      'BLUSA MARFIL amplía UNIQUE con una pieza superior de lectura clara. Su color, declarado en el nombre, permite construir combinaciones suaves o contrastadas dentro del universo ISOLÉ. Es una prenda pensada para acompañar diferentes composiciones sin imponer una sola forma de llevarla.',
  },
  {
    slug: 'vestido-primaveral-corto',
    name: 'VESTIDO PRIMAVERAL CORTO',
    category: 'UNIQUE',
    shortDescription:
      'Vestido corto de la colección UNIQUE para looks frescos de espíritu primaveral.',
    description:
      'VESTIDO PRIMAVERAL CORTO lleva a UNIQUE una pieza con una lectura fresca y de temporada desde su propio nombre. Puede funcionar como protagonista del look en momentos de día o de clima cálido. No se agregan detalles de largo exacto, tela o construcción porque no aparecen en la fuente de datos.',
  },
  {
    slug: 'corset-celestial',
    name: 'CORSET CELESTIAL',
    category: 'CELESTIAL',
    shortDescription:
      'Corset de la colección CELESTIAL para looks con una intención delicada y marcada.',
    description:
      'CORSET CELESTIAL pertenece a una colección conectada con la idea de luz interior y expresión personal. Es una pieza superior que puede dar protagonismo a la composición sin necesidad de describir soporte o estructura no documentada. Su nombre aporta una lectura delicada dentro del catálogo.',
  },
  {
    slug: 'falda-celestial',
    name: 'FALDA CELESTIAL',
    category: 'CELESTIAL',
    shortDescription:
      'Falda de la colección CELESTIAL para composiciones suaves con presencia propia.',
    description:
      'FALDA CELESTIAL completa la colección con una prenda inferior de intención delicada. Puede combinarse con el corset de la misma línea o con otras prendas superiores del catálogo. La descripción conserva un tono cercano y prudente, sin afirmar materialidad, ajuste o medidas no verificadas.',
  },
]

export function getActiveProducts() {
  return products.filter((product) => product.isActive !== false)
}

export function getProduct(slug: string) {
  return getActiveProducts().find((product) => product.slug === slug)
}

export function getCatalogGroup(slug: string) {
  return catalogGroups.find((group) => group.slug === slug)
}

export function getCatalogProducts(group: CatalogGroup) {
  if (group.type === 'aggregate') {
    return uniqueProducts(getActiveProducts())
  }

  const productBySlug = new Map(
    getActiveProducts().map((product) => [product.slug, product]),
  )

  return uniqueProducts(
    (group.productSlugs ?? [])
      .map((slug) => productBySlug.get(slug))
      .filter((product): product is Product => Boolean(product)),
  )
}

export function getProductImages(product: Product) {
  const images = [
    ...(product.gallery ?? []),
    product.model,
    product.product,
  ].filter((image): image is string => Boolean(image))

  return images.length > 0 ? uniqueValues(images) : ['/placeholder.svg']
}

export function getRelatedProducts(product: Product) {
  const group = catalogGroups.find((catalogGroup) =>
    catalogGroup.productSlugs?.includes(product.slug),
  )
  const pool = group ? getCatalogProducts(group) : getActiveProducts()

  return pool
    .filter((relatedProduct) => relatedProduct.slug !== product.slug)
    .slice(0, 4)
}

function uniqueProducts(items: Product[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.slug)) {
      return false
    }

    seen.add(item.slug)
    return true
  })
}

function uniqueValues(items: string[]) {
  return [...new Set(items)]
}
