/**
 * WordPress REST API — data layer
 *
 * Set NEXT_PUBLIC_WP_URL in .env.local to your WordPress installation URL.
 * All queries use ISR (next: { revalidate: 3600 }) so pages auto-refresh
 * every hour without a full rebuild.  A revalidation webhook can reset this
 * immediately when the client publishes a new post (see /api/revalidate/route.ts).
 */

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

export interface WPImage {
  source_url: string
  alt_text:   string
  width:      number
  height:     number
}

export interface WPCategory {
  id:    number
  name:  string
  slug:  string
  count: number
}

export interface WPPost {
  id:             number
  slug:           string
  title:          { rendered: string }
  excerpt:        { rendered: string }
  content:        { rendered: string }
  date:           string
  modified:       string
  categories:     number[]
  meta: {
    dubai_audio_file?:  string   // URL of uploaded MP3
    dubai_audio_title?: string   // Episode title
    _meta_description?: string   // SEO description
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text:   string
      media_details?: { width: number; height: number }
    }>
    'wp:term'?: Array<WPCategory[]>
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

const WP = (process.env.NEXT_PUBLIC_WP_URL ?? '').replace(/\/$/, '')
const API = `${WP}/wp-json/wp/v2`

/** Strip HTML from WP rendered strings */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, (e) => {
    const map: Record<string, string> = { '&amp;': '&', '&quot;': '"', '&#39;': "'", '&lt;': '<', '&gt;': '>' }
    return map[e] ?? e
  })
}

/** Estimate reading time in minutes (200 words/min) */
export function estimateReadingTime(html: string): number {
  const text  = stripHtml(html)
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.ceil(words / 200)
}

/** Format a WP date string to pt-BR readable */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

/** Extract featured image from embedded data */
export function getFeaturedImage(post: WPPost): WPImage | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return null
  return {
    source_url: media.source_url,
    alt_text:   media.alt_text || stripHtml(post.title.rendered),
    width:      media.media_details?.width  ?? 1200,
    height:     media.media_details?.height ?? 630,
  }
}

/** Get primary category from embedded terms */
export function getPrimaryCategory(post: WPPost): WPCategory | null {
  const cats = post._embedded?.['wp:term']?.[0]
  return cats?.[0] ?? null
}

// ──────────────────────────────────────────────────────────────────────────────
// Fetch functions
// ──────────────────────────────────────────────────────────────────────────────

const EMBED  = '&_embed=wp:featuredmedia,wp:term'
const FIELDS = '&_fields=id,slug,title,excerpt,content,date,modified,categories,meta,_links,_embedded'

async function wpFetch<T>(path: string): Promise<T> {
  const url = `${API}${path}`
  const res  = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`WP API error ${res.status}: ${url}`)
  return res.json() as Promise<T>
}

/** Fetch multiple posts */
export async function getPosts(params?: {
  perPage?:  number
  page?:     number
  category?: number
  search?:   string
  sticky?:   boolean
}): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
  const { perPage = 10, page = 1, category, search, sticky } = params ?? {}
  let qs = `?per_page=${perPage}&page=${page}${EMBED}${FIELDS}`
  if (category)          qs += `&categories=${category}`
  if (search)            qs += `&search=${encodeURIComponent(search)}`
  if (sticky !== undefined) qs += `&sticky=${sticky ? 1 : 0}`

  const res = await fetch(`${API}/posts${qs}`, { next: { revalidate: 3600 } })
  if (!res.ok) {
    // Return empty list gracefully (useful in dev before WP is connected)
    return { posts: [], total: 0, totalPages: 0 }
  }
  const posts      = (await res.json()) as WPPost[]
  const total      = parseInt(res.headers.get('X-WP-Total')      ?? '0', 10)
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10)
  return { posts, total, totalPages }
}

/** Fetch a single post by slug — no-store so revalidatePath always hits WP fresh */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const url = `${API}/posts?slug=${slug}${EMBED}${FIELDS}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return null
  const posts = (await res.json()) as WPPost[]
  return posts[0] ?? null
}

/** Fetch all post slugs (for generateStaticParams) */
export async function getAllPostSlugs(): Promise<string[]> {
  const res = await fetch(`${API}/posts?per_page=100&_fields=slug`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []
  const posts = (await res.json()) as Array<{ slug: string }>
  return posts.map((p) => p.slug)
}

/** Fetch all categories */
export async function getCategories(): Promise<WPCategory[]> {
  const cats = await wpFetch<WPCategory[]>('/categories?per_page=50&hide_empty=false')
  return cats
}

/** Fetch a category by slug */
export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const cats = await wpFetch<WPCategory[]>(`/categories?slug=${slug}`)
  return cats[0] ?? null
}

/** Fetch all category slugs (for generateStaticParams) */
export async function getAllCategorySlugs(): Promise<string[]> {
  const cats = await wpFetch<Array<{ slug: string }>>('/categories?per_page=50&hide_empty=true&_fields=slug')
  return cats.map((c) => c.slug)
}

// ──────────────────────────────────────────────────────────────────────────────
// Fallback / mock data
// Used when NEXT_PUBLIC_WP_URL is not set (local dev without WordPress)
// ──────────────────────────────────────────────────────────────────────────────

// ── "Últimas notícias": 14 posts (featured + 2 overlay + 3 plain + 8 list) ────
const LATEST_META: Array<{
  title: string
  excerpt: string
  cat: WPCategory
  date: string
}> = [
  // [0] Featured
  {
    title:   'Como funciona o mercado imobiliário de Dubai: rentabilidade, ROI e valorização para brasileiros',
    excerpt: 'Dubai consolidou-se como o destino favorito dos investidores globais que buscam proteção cambial e altos rendimentos com segurança jurídica.',
    cat:     { id: 1, name: 'Investimento', slug: 'investimento', count: 12 },
    date:    '2026-05-25T10:00:00.000Z',
  },
  // [1] Overlay 1
  {
    title:   'Downtown vs Dubai Marina vs Palm Jumeirah: onde o ROI é maior em 2025?',
    excerpt: 'Comparativo completo de rentabilidade por região com dados reais de valorização.',
    cat:     { id: 6, name: 'Comparativo', slug: 'comparativo', count: 4 },
    date:    '2026-05-22T10:00:00.000Z',
  },
  // [2] Overlay 2
  {
    title:   'Requisitos, valores mínimos, tempo de processo e benefícios para a família inteira.',
    excerpt: 'Comparativo completo de rentabilidade por região com dados reais de valorização.',
    cat:     { id: 3, name: 'Visto Dourado', slug: 'visto-dourado', count: 5 },
    date:    '2026-05-20T10:00:00.000Z',
  },
  // [3] Plain 1
  {
    title:   'Dubai x Miami x Portugal: qual o melhor destino para dolarizar patrimônio?',
    excerpt: 'Análise comparativa dos três mercados mais buscados por brasileiros que querem proteger capital em moeda forte.',
    cat:     { id: 11, name: 'Dolarização', slug: 'dolarizacao', count: 6 },
    date:    '2026-05-19T10:00:00.000Z',
  },
  // [4] Plain 2
  {
    title:   'Como transferir dinheiro do Brasil para comprar imóvel em Dubai',
    excerpt: 'Passo a passo jurídico e cambial para enviar recursos ao exterior com segurança e menor custo.',
    cat:     { id: 12, name: 'Transferência', slug: 'transferencia', count: 5 },
    date:    '2026-05-12T10:00:00.000Z',
  },
  // [5] Plain 3
  {
    title:   'Como declarar imóvel em Dubai no imposto de renda brasileiro',
    excerpt: 'Entenda as obrigações fiscais do brasileiro que possui bens no exterior e como declará-los corretamente.',
    cat:     { id: 13, name: 'Declaração', slug: 'declaracao', count: 4 },
    date:    '2026-05-11T10:00:00.000Z',
  },
  // [6–13] List (Mais artigos)
  {
    title:   'Marina District: o bairro mais valorizado de Dubai para estrangeiros',
    excerpt: 'O mercado imobiliário de Dubai continua crescendo de forma expressiva, com retornos que surpreendem.',
    cat:     { id: 2, name: 'Regiões', slug: 'regioes', count: 8 },
    date:    '2026-05-08T10:00:00.000Z',
  },
  {
    title:   'Visto Dourado: como obter residência em Dubai comprando imóvel',
    excerpt: 'Conheça os tipos de visto disponíveis e como o imóvel pode ser a chave para sua residência nos Emirados.',
    cat:     { id: 3, name: 'Visto Dourado', slug: 'visto-dourado', count: 5 },
    date:    '2026-05-06T10:00:00.000Z',
  },
  {
    title:   'Como abrir conta bancária em Dubai sendo pessoa física estrangeira',
    excerpt: 'Passo a passo para brasileiros abrirem conta nos principais bancos emiradenses sem precisar de visto de residência.',
    cat:     { id: 1, name: 'Investimento', slug: 'investimento', count: 12 },
    date:    '2026-05-05T10:00:00.000Z',
  },
  {
    title:   'Tributação de imóveis em Dubai para brasileiros: o que saber antes',
    excerpt: 'Dubai não cobra IPTU nem imposto de renda local, mas as obrigações fiscais brasileiras permanecem.',
    cat:     { id: 4, name: 'Jurídico', slug: 'juridico', count: 7 },
    date:    '2026-05-03T10:00:00.000Z',
  },
  {
    title:   'O que são imóveis offplan em Dubai e como investir com segurança',
    excerpt: 'Imóveis na planta oferecem preços menores e alta valorização, mas exigem due diligence criteriosa do desenvolvedor.',
    cat:     { id: 1, name: 'Investimento', slug: 'investimento', count: 12 },
    date:    '2026-05-01T10:00:00.000Z',
  },
  {
    title:   'Downtown Dubai vs Business Bay: qual escolher para investir?',
    excerpt: 'Comparamos localização, preço por m², liquidez e potencial de aluguel dos dois bairros mais disputados do centro.',
    cat:     { id: 6, name: 'Comparativo', slug: 'comparativo', count: 4 },
    date:    '2026-04-28T10:00:00.000Z',
  },
  {
    title:   'Passaporte para o mundo: como o imóvel em Dubai facilita vistos internacionais',
    excerpt: 'Com residência nos Emirados, brasileiros ganham acesso facilitado a mais de 170 países e facilidades bancárias globais.',
    cat:     { id: 3, name: 'Visto Dourado', slug: 'visto-dourado', count: 5 },
    date:    '2026-04-25T10:00:00.000Z',
  },
  {
    title:   'Guia de bairros de Dubai: onde comprar para cada perfil de investidor',
    excerpt: 'De Palm Jumeirah ao Dubai South — qual região tem melhor relação entre preço de entrada, yield e liquidez.',
    cat:     { id: 2, name: 'Regiões', slug: 'regioes', count: 8 },
    date:    '2026-04-22T10:00:00.000Z',
  },
]

const PLACEHOLDER_CONTENT: string[] = [
  // [0] Como funciona o mercado imobiliário de Dubai
  `<p>Dubai consolidou-se como um dos mercados imobiliários mais atrativos do mundo, especialmente para investidores brasileiros que buscam proteção cambial, alta rentabilidade e segurança jurídica. Em 2024, o emirado registrou um volume recorde de transações imobiliárias, superando AED 400 bilhões — crescimento de 20% em relação ao ano anterior. Esse dinamismo reflete não apenas a confiança dos investidores globais, mas também um conjunto de políticas governamentais que tornam Dubai um dos poucos mercados do mundo com crescimento sustentável e ambiente regulatório transparente.</p>

<p>Parte desse sucesso vem da ausência total de impostos sobre propriedade e renda. Diferente de mercados europeus e americanos, onde o investidor enfrenta imposto de renda sobre aluguel, imposto sobre ganho de capital e anuidades de IPTU, em Dubai o retorno bruto e o retorno líquido são praticamente idênticos. Para o investidor brasileiro acostumado a uma carga tributária pesada, essa diferença é transformadora no longo prazo.</p>

<h2>ROI acima da média global</h2>
<p>O retorno médio sobre aluguel (rental yield) em Dubai gira entre 6% e 9% ao ano, dependendo da região e do tipo de imóvel. Para comparação, São Paulo apresenta yield médio de 4%, Lisboa oscila entre 3% e 5%, e Miami raramente supera 5% líquido depois dos impostos americanos. Essa diferença de 2 a 4 pontos percentuais ao ano, composta ao longo de 10 anos, representa um ganho patrimonial significativo que muda completamente o cálculo do investimento.</p>

<p>Além do yield, a valorização nominal dos imóveis tem sido expressiva. Bairros como Palm Jumeirah e Downtown Dubai acumularam 20% a 30% de valorização em 2023-2024, impulsionados pela entrada de capital estrangeiro, pelo crescimento populacional da cidade e pela expansão do turismo de alto padrão. Para o investidor brasileiro, a valorização em dólar (o AED é atrelado ao USD desde 1997 na taxa de 3,67) representa uma proteção adicional contra a inflação e a desvalorização do real.</p>

<h2>Ambiente regulatório e segurança jurídica</h2>
<p>O Dubai Land Department (DLD) é o órgão responsável pelo registro de todas as transações imobiliárias no emirado. Toda compra é registrada digitalmente, com emissão do Title Deed (escritura de propriedade) em nome do comprador. O sistema de escrow obrigatório para projetos offplan — gerenciado pelo DLD e por bancos credenciados — protege o comprador contra riscos de inadimplência da incorporadora. Esse nível de institucionalização é comparável ao de mercados desenvolvidos como Singapura e Austrália.</p>

<p>Para o estrangeiro, a legislação emiradense permite propriedade plena (freehold) em zonas designadas, que cobrem os principais bairros de interesse para investimento: Downtown, Marina, Palm Jumeirah, Business Bay, JVC, Dubai Hills e outras. O processo de compra pode ser concluído em 5 a 7 dias úteis para imóveis prontos, com transferência digital de propriedade via plataforma DLD-REST. Não há restrição de nacionalidade para compra de imóveis nessas zonas.</p>

<h2>O Visto Dourado como diferencial estratégico</h2>
<p>Um dos grandes catalisadores do interesse brasileiro em Dubai é o Visto Dourado (Golden Visa), que concede residência de 10 anos para investidores que adquirem imóveis a partir de AED 2 milhões (aproximadamente USD 545 mil). O visto é extensível ao cônjuge, filhos e funcionários domésticos. Diferente dos programas de residência europeus, o Golden Visa dos UAE não exige permanência mínima no país — o investidor pode continuar vivendo no Brasil enquanto mantém a residência emiradense ativa.</p>

<p>Para a família brasileira que pensa em diversificação patrimonial e mobilidade global, a combinação de imóvel rentável + Golden Visa + conta bancária internacional cria uma plataforma de proteção e crescimento que poucos instrumentos de investimento conseguem replicar. O passo inicial é entender as regulamentações do Banco Central brasileiro para remessa de recursos ao exterior e contar com assessoria especializada para a due diligence do imóvel escolhido.</p>

<h2>Por que 2025 é um bom momento para entrar</h2>
<p>Apesar da valorização recente, analistas de mercado indicam que Dubai ainda está na fase intermediária do seu ciclo imobiliário. A Expo 2020 deixou um legado de infraestrutura e visibilidade global. O governo emiradense mantém o ritmo de grandes projetos — Palm Jebel Ali, Dubai Creek Harbour, Dubai Islands — que continuarão atraindo capital e população. A previsão do governo é dobrar a população de Dubai para 5,8 milhões de pessoas até 2040, o que sustenta a demanda por imóveis no longo prazo.</p>

<ul>
  <li>Sem imposto de renda sobre aluguel ou ganho de capital</li>
  <li>Yield médio entre 6% e 9% ao ano</li>
  <li>Processo de compra em até 7 dias úteis</li>
  <li>Visto Dourado (residência de 10 anos) disponível para investidores acima de AED 2 mi</li>
  <li>Mercado regulado pelo DLD com escrow obrigatório para offplan</li>
  <li>AED atrelado ao dólar desde 1997 — proteção cambial natural</li>
</ul>

<p>Para o investidor brasileiro que deseja diversificar seu patrimônio e conquistar proteção cambial real, Dubai representa hoje uma das oportunidades mais completas do mercado global. O primeiro passo é entender o processo completo — das remessas internacionais às obrigações fiscais brasileiras — e contar com especialistas que conheçam ambos os lados dessa equação.</p>`,

  // [1] Downtown vs Dubai Marina vs Palm Jumeirah
  `<p>Escolher a região certa é, possivelmente, a decisão mais importante no processo de investimento imobiliário em Dubai. Três áreas concentram a maior parte da demanda de estrangeiros e respondem por parcela significativa do volume de transações da cidade: Downtown Dubai, Dubai Marina e Palm Jumeirah. Cada uma tem perfil distinto de comprador, faixa de preço e potencial de valorização — e entender essas diferenças é o primeiro passo para uma decisão acertada.</p>

<p>A análise que se segue é baseada em dados de transações do Dubai Land Department (DLD) e relatórios de consultorias como CBRE, JLL e Betterhomes, referentes ao período 2023-2025. Os preços indicados são médias por metro quadrado e os yields são estimativas anualizadas para apartamentos de 1 a 2 quartos, o segmento mais líquido para investidores estrangeiros.</p>

<h2>Downtown Dubai: prestígio, liquidez e valorização nominal</h2>
<p>Home ao Burj Khalifa e ao Dubai Mall, o Downtown é a área mais icônica e reconhecida da cidade — e do mundo. O preço médio por m² gira em torno de AED 2.800 a AED 3.200 (cerca de USD 760 a USD 870), com yields de aluguel entre 5% e 7%. O perfil típico do comprador é o investidor que prioriza prestígio, reconhecimento de marca global e alta liquidez na revenda. Em 2024, o Downtown foi a região com maior valorização nominal em valor absoluto, acumulando aproximadamente 22% em 12 meses.</p>

<p>A desvantagem é o ticket de entrada elevado: apartamentos de 1 quarto raramente ficam abaixo de AED 1,5 milhão (USD 410 mil), e unidades com vista para o Burj Khalifa partem de AED 2,5 milhões. Para investidores que buscam o Golden Visa (mínimo AED 2 mi), o Downtown oferece diversas opções que satisfazem o requisito de elegibilidade com imóveis em endereço premium. O mercado de aluguel é aquecido durante todo o ano, com alta demanda de turistas e executivos.</p>

<h2>Dubai Marina: o equilíbrio ideal entre yield e acessibilidade</h2>
<p>Dubai Marina é, historicamente, a região favorita dos expatriados e investidores de médio porte. Com preços médios entre AED 1.800 e AED 2.400 por m², apresenta yields consistentemente acima de 7%, impulsionados pela altíssima demanda de expatriados que trabalham em JLT (Jumeirah Lakes Towers) e DIFC (Dubai International Financial Centre). Apartamentos de 1 quarto com vista para o canal ou para o mar têm ocupação próxima de 95% ao longo do ano.</p>

<p>A região também se destaca pelo mercado de aluguel de curta duração via Airbnb: a marina, o waterfront boulevard e a proximidade com a praia de JBR (Jumeirah Beach Residence) atraem turistas de alto padrão durante o inverno do Golfo (outubro a abril). Investidores que combinam aluguel de longa e curta duração reportam yields efetivos de 8% a 10% ao ano. O tramway e o metrô integram a Marina ao resto da cidade, garantindo valorização estrutural no longo prazo.</p>

<h2>Palm Jumeirah: ultra-luxo, apreciação de capital e exclusividade</h2>
<p>Palm Jumeirah é o endereço mais exclusivo de Dubai — e possivelmente do Oriente Médio. As villas nas fronds da palmeira e os apartamentos dos condomínios como One Palm, Five Palm e Atlantis The Royal definem o segmento de ultra-luxo do mercado. Preços médios para villas partem de AED 15 milhões (USD 4 milhões), e os yields de aluguel são menores — em torno de 3% a 5% — mas a apreciação de capital mais do que compensa: a Palm registrou valorização superior a 40% entre 2020 e 2024.</p>

<p>Para o investidor brasileiro com capital acima de USD 2 milhões, Palm Jumeirah representa uma reserva de valor em ativo real com apelo global. A demanda é sustentada por compradores russos, europeus e do Oriente Médio, o que garante liquidez mesmo em momentos de instabilidade global. O perfil do locatário na Palm é de executivos de alto escalão, celebridades e famílias de ultra-high-net-worth, o que eleva o ticket médio de aluguel e reduz a vacância.</p>

<h2>Comparativo direto: qual escolher?</h2>
<ul>
  <li><strong>Para máximo yield (6%-9%):</strong> Dubai Marina — melhor relação risco-retorno para capital entre USD 300 mil e USD 600 mil</li>
  <li><strong>Para liquidez premium e reconhecimento global:</strong> Downtown Dubai — ideal para quem prioriza revenda e Golden Visa</li>
  <li><strong>Para apreciação de capital e reserva de valor:</strong> Palm Jumeirah — para capital acima de USD 1 milhão e horizonte de 5+ anos</li>
</ul>

<p>A decisão final depende do capital disponível, do horizonte de investimento e do objetivo principal — renda corrente ou valorização patrimonial. Para investidores iniciantes no mercado de Dubai, Dubai Marina costuma ser o ponto de entrada mais equilibrado, com ticket acessível, alta liquidez e rentabilidade comprovada.</p>`,

  // [2] Visto Dourado: requisitos, valores mínimos
  `<p>O Visto Dourado dos Emirados Árabes Unidos — oficialmente denominado UAE Golden Visa — é um programa de residência de longo prazo criado em 2019 com o objetivo de atrair investidores, empresários, talentos e suas famílias para o país. Diferente dos vistos de trabalho tradicionais, o Golden Visa não exige patrocinador local (empresa ou empregador emiradense) e concede ao titular uma residência de 10 anos, renovável, com benefícios extensíveis a toda a família imediata. Para brasileiros que desejam internacionalizar seu patrimônio, este é um dos programas de residência mais acessíveis e vantajosos disponíveis no mundo hoje.</p>

<p>Desde sua criação, o Golden Visa passou por diversas atualizações que ampliaram os critérios de elegibilidade e tornaram o processo mais acessível. A via imobiliária é, sem dúvida, a mais utilizada por brasileiros — e é sobre ela que este guia se concentra, detalhando requisitos, valores mínimos, processo e benefícios para a família.</p>

<h2>Requisitos e valores mínimos para a via imobiliária</h2>
<p>Para obter o Golden Visa via investimento imobiliário, o comprador deve adquirir um imóvel (ou conjunto de imóveis) com valor mínimo registrado de AED 2 milhões — aproximadamente USD 545 mil ou R$ 2,7 milhões na cotação atual. O imóvel pode ser comprado à vista ou financiado via banco emiradense: neste caso, o valor já pago (equity) precisa atingir AED 2 milhões. Imóveis offplan (na planta) também são elegíveis, desde que o desenvolvedor seja aprovado pelo DLD (Dubai Land Department) e o valor total do contrato atinja o mínimo exigido.</p>

<p>Uma regra importante: o imóvel precisa estar em zonas freehold designadas pelo governo emiradense (Downtown, Marina, Palm Jumeirah, Business Bay, JVC etc.), e o Title Deed (escritura de propriedade) deve ser emitido em nome do requerente do visto. Imóveis registrados em nome de empresa não são elegíveis para a via imobiliária do Golden Visa — nesses casos, a empresa deve ter participação acionária do requerente com valor correspondente aos AED 2 milhões.</p>

<h2>Benefícios para toda a família</h2>
<p>Um dos maiores atrativos do Golden Visa é sua abrangência familiar. O titular pode incluir no mesmo visto: cônjuge (independentemente do regime de casamento), filhos solteiros (sem limite de idade para filhos com deficiência; até 25 anos para os demais) e filhos divorciados ou viúvos a cargo do titular. Pais também podem ser incluídos mediante comprovação de dependência financeira. Funcionários domésticos (empregadas, motoristas, babás) também podem ser patrocinados pelo titular do Golden Visa.</p>

<p>Cada dependente recebe seu próprio Emirates ID e visto de residência com mesma validade do titular. Crianças têm acesso às escolas emiradenses (públicas e privadas) com o mesmo status de residente. Adultos dependentes podem trabalhar nos UAE se obtiverem permissão de trabalho — o que é facilitado pela residência. A família inteira pode abrir contas bancárias, contratar planos de saúde e utilizar todos os serviços públicos dos Emirados.</p>

<h2>Processo passo a passo e prazos</h2>
<p>O processo de obtenção do Golden Visa via imóvel segue esta sequência: (1) Comprar o imóvel e registrá-lo no DLD, obtendo o Title Deed; (2) Solicitar junto ao DLD um "Affection Letter" ou "NOC" confirmando o valor de mercado acima de AED 2 mi; (3) Submeter o pedido de Golden Visa ao GDRFA (General Directorate of Residency and Foreigners Affairs) via plataforma online ou presencialmente; (4) Realizar exame médico em clínica credenciada pelos UAE; (5) Coletar digitais e foto biométrica; (6) Pagar taxas governamentais (AED 2.800 a AED 4.000 por pessoa); (7) Receber o Emirates ID em até 10 dias úteis após aprovação.</p>

<ul>
  <li>Prazo total estimado: 30 a 60 dias</li>
  <li>Validade do Golden Visa: 10 anos, renovável</li>
  <li>Ausência máxima permitida: sem limite definido (diferente de vistos europeus)</li>
  <li>Exigência de permanência mínima: nenhuma</li>
  <li>Taxas governamentais: AED 2.800 a AED 4.000 por pessoa</li>
</ul>

<h2>Golden Visa vs. outros programas de residência por investimento</h2>
<p>Comparado com programas similares no mundo, o Golden Visa dos UAE se destaca em vários aspectos. Portugal exige permanência mínima de 7 dias por ano e o processo pode durar 12 a 24 meses. Malta tem custo de entrada acima de EUR 690 mil com taxas não reembolsáveis. Grécia oferece residência por EUR 250 mil, mas com cidadania europeia demorada. O Golden Visa dos UAE é o único programa do mundo que combina: investimento mínimo relativamente acessível, processo rápido (30-60 dias), ausência total de exigência de permanência mínima e zero imposto de renda sobre renda mundial para pessoas físicas residentes.</p>

<p>Para o brasileiro que busca uma segunda residência com propósito estratégico — proteção patrimonial, mobilidade global, acesso a serviços bancários internacionais e um "plano B" para a família —, o Golden Visa dos UAE via investimento imobiliário em Dubai é hoje uma das opções mais completas e acessíveis disponíveis. A assessoria de um agente imobiliário licenciado pelo RERA e de um consultor jurídico especializado é fortemente recomendada para garantir que toda a documentação esteja em ordem desde o início do processo.</p>`,

  // [3] Dubai x Miami x Portugal
  `<p>Para o investidor brasileiro que deseja dolarizar seu patrimônio e obter proteção contra a volatilidade do real, três destinos dominam as conversas: Dubai, Miami e Portugal. Cada mercado tem características próprias em termos de tributação, rentabilidade, burocracia, qualidade de vida e perspectivas de médio e longo prazo. Uma análise comparativa honesta e baseada em dados é essencial para alinhar a escolha ao perfil, objetivos e realidade de cada investidor.</p>

<p>Este comparativo considera o perfil do investidor brasileiro típico: capital entre USD 300 mil e USD 1,5 milhão, objetivo de diversificação patrimonial e proteção cambial, com possível interesse em residência no exterior no médio prazo. Os dados de preços, yields e tributação são referentes ao período 2024-2025.</p>

<h2>Tributação e rentabilidade líquida: onde o dinheiro rende mais</h2>
<p>Dubai é o vencedor absoluto na categoria tributação. Os Emirados não cobram imposto de renda sobre pessoas físicas, o que significa que aluguéis e ganhos de capital na venda do imóvel são completamente isentos de tributação local. O custo de aquisição é previsível: 4% de taxa de registro no DLD e aproximadamente 2% de comissão do agente imobiliário. Sem IPTU, sem IR sobre aluguel, sem imposto sobre herança. O yield líquido para o investidor fica entre 6% e 9% ao ano — quase integral, pois não há dedução fiscal local.</p>

<p>Miami apresenta uma carga tributária significativamente maior para o investidor brasileiro. A venda do imóvel está sujeita ao FIRPTA (Foreign Investment in Real Property Tax Act), que retém 15% do preço de venda na fonte. Os aluguéis são tributados pelo IRS federal (alíquotas de até 37% sobre o lucro). O Estado da Flórida não cobra imposto estadual de renda, o que é uma vantagem, mas o custo total de estruturação — com LLC, contador americano, relatórios fiscais — eleva consideravelmente a fricção. Yield líquido real para o brasileiro gira entre 3,5% e 5%.</p>

<h2>Portugal: o regime NHR perde atratividade</h2>
<p>Portugal foi, por anos, a escolha preferida do brasileiro que queria a cidadania europeia no horizonte. O regime NHR (Non-Habitual Resident) oferecia tributação favorável de 20% sobre rendimentos de trabalho e isenção sobre algumas rendas do exterior. Porém, em 2024, o governo português eliminou o NHR para novos aderentes e criou o regime IFICI, mais restritivo. Combinado com a burocracia portuguesa — processos cartoriais que duram meses, filas no SEF para vistos, aprovações que se arrastam por anos — Portugal perdeu atratividade para o investidor que busca eficiência.</p>

<p>Os yields em Lisboa e Porto ficam entre 3% e 4,5% brutos, com o investimento mínimo para o Golden Visa português agora limitado a fundos imobiliários (não mais compra direta de imóvel residencial nas grandes cidades). Ainda assim, Portugal mantém apelo para quem tem o objetivo claro de obter a cidadania europeia em 5 anos — algo que Dubai não oferece.</p>

<h2>Burocracia e processo de compra: velocidade importa</h2>
<p>Dubai se destaca pela eficiência radical no processo de compra. Todo o fluxo — proposta, contrato, pagamento, registro e emissão do Title Deed — pode ser concluído em 5 a 7 dias úteis para imóveis prontos. O DLD opera um sistema digital que permite registro e transferência de propriedade online. Brasileiros não precisam de visto para comprar em Dubai: o processo pode ser iniciado remotamente e finalizado em uma visita de 3 a 5 dias ao emirado.</p>

<p>Em Miami, o processo é ágil (2 a 4 semanas para fechar), mas a estruturação fiscal — criação de LLC, abertura de conta bancária americana, ITIN (número fiscal para estrangeiros) — adiciona complexidade e custo. Em Portugal, o processo é o mais demorado dos três: obtenção de NIF, abertura de conta bancária, escritura em cartório e registro de imóvel podem levar de 3 a 6 meses, com filas e burocracia excessiva.</p>

<h2>Qualidade de vida e perfil de investidor</h2>
<ul>
  <li><strong>Dubai:</strong> melhor para yield, zero imposto local, processo rápido — ideal para quem prioriza retorno financeiro e proteção cambial</li>
  <li><strong>Miami:</strong> melhor para proximidade cultural com EUA, investimento em mercado dolarizado, imigração americana no horizonte</li>
  <li><strong>Portugal:</strong> melhor para quem tem cidadania europeia como objetivo de longo prazo e prioriza qualidade de vida mediterrânea</li>
</ul>

<p>Para o investidor brasileiro que busca maximizar rentabilidade, agilidade no processo e zero tributação local, Dubai é a escolha mais racional em 2025. Miami agrada quem quer proximidade cultural com os EUA e o sonho americano. Portugal permanece interessante para quem coloca a cidadania europeia como meta prioritária, mesmo que o retorno financeiro seja menor. A decisão certa é aquela que equilibra objetivos financeiros, pessoais e familiares de forma coerente.</p>`,

  // [4] Como transferir dinheiro do Brasil
  `<p>Transferir recursos do Brasil para comprar um imóvel no exterior é um processo completamente legal e regulamentado pelo Banco Central do Brasil (BCB) — desde que feito pelo caminho correto. A falta de planejamento nessa etapa é um dos erros mais comuns do investidor iniciante, e pode gerar problemas com a Receita Federal no futuro, dificuldades na repatriação dos recursos e, em casos extremos, configurar evasão de divisas. Este guia detalha o processo correto, os custos envolvidos e as melhores práticas para uma transferência segura e eficiente.</p>

<p>O ponto de partida fundamental é entender que o Brasil não proíbe a remessa de recursos para o exterior — ao contrário, o BCB regula e facilita esse processo. O que é obrigatório é declarar a operação corretamente e utilizar intermediários autorizados (bancos e corretoras de câmbio licenciados pelo BCB).</p>

<h2>Regulamentação do Banco Central e a declaração CBE</h2>
<p>Toda transferência para o exterior deve ser realizada por meio de um banco comercial ou corretora de câmbio autorizada pelo BCB. A operação deve ser classificada corretamente: para compra de imóvel, a natureza cambial geralmente é "Investimento Direto no Exterior" (para pessoa jurídica) ou "Aquisição de Ativo no Exterior" (para pessoa física). Essa classificação aparece no contrato de câmbio e é o documento que comprova a legalidade da operação para a Receita Federal.</p>

<p>Brasileiros que mantêm bens e direitos no exterior com valor total acima de USD 1 milhão são obrigados a apresentar ao BCB a Declaração de Capitais Brasileiros no Exterior (CBE), com periodicidade anual. Se o total superar USD 100 milhões, a declaração é trimestral. Mesmo abaixo de USD 1 milhão, é altamente recomendável manter registros detalhados de todas as remessas, pois esses documentos serão necessários para a declaração de imposto de renda e para eventual repatriação futura dos recursos.</p>

<h2>Câmbio: como minimizar o custo da operação</h2>
<p>O custo de câmbio é um fator relevante que o investidor muitas vezes subestima. Para remessas ao exterior em AED (dirham dos Emirados) ou USD, os principais canais e seus spreads típicos são: bancos tradicionais brasileiros (Itaú, Bradesco, BB) cobram spreads de 1,5% a 3% sobre a taxa de câmbio de mercado; corretoras de câmbio (Treviso, Ourominas, B&T) oferecem spreads de 0,8% a 1,5%; fintechs especializadas (Wise, Remessa Online) operam com spreads de 0,3% a 0,7% para valores acima de USD 50 mil.</p>

<ul>
  <li><strong>IOF:</strong> 0,38% sobre remessas para compra de imóvel no exterior (pessoa física)</li>
  <li><strong>Spread bancário:</strong> varia de 0,3% a 3% dependendo do intermediário</li>
  <li><strong>Tarifa de transferência internacional (SWIFT):</strong> geralmente USD 20 a USD 50 por operação</li>
  <li><strong>Tempo de liquidação:</strong> D+2 a D+3 dias úteis para AED ou USD</li>
</ul>

<h2>Abrindo conta bancária nos Emirados antes da compra</h2>
<p>Uma estratégia muito utilizada por investidores experientes é abrir uma conta bancária em Dubai antes de iniciar o processo de compra. Com uma conta em AED ou USD nos Emirados, o investidor pode: receber os recursos do Brasil de forma mais eficiente, realizar os pagamentos à incorporadora ou vendedor em moeda local, receber os aluguéis diretamente na conta emiradense e planejar melhor a repatriação futura. Bancos como Emirates NBD, RAKBANK e Mashreq Bank têm divisões especializadas em clientes não-residentes e oferecem abertura de conta para estrangeiros sem visto de residência, embora com saldo mínimo inicial (tipicamente AED 10.000 a AED 50.000).</p>

<p>Após a compra, os rendimentos de aluguel recebidos no exterior devem ser declarados no Imposto de Renda brasileiro como "rendimentos tributáveis recebidos de fontes no exterior", sujeitos à tabela progressiva do IRPF (até 27,5%). Manter registros detalhados de todas as remessas, contratos de câmbio, extratos bancários e documentos da compra é essencial para comprovar a origem lícita dos recursos em eventual fiscalização da Receita Federal.</p>`,

  // [5] Como declarar imóvel em Dubai no IR
  `<p>A aquisição de um imóvel no exterior é um evento tributário significativo para o contribuinte brasileiro. Diferentemente do que alguns acreditam, as obrigações com a Receita Federal não desaparecem pelo simples fato de o bem estar localizado fora do Brasil. Ao contrário: o Fisco brasileiro exige declaração detalhada do imóvel, dos rendimentos gerados e do capital investido — e as penalidades por omissão são severas, podendo chegar a 150% do valor omitido em casos de fraude. Este guia cobre as principais obrigações do investidor brasileiro que possui imóvel em Dubai.</p>

<p>A legislação brasileira adota o princípio da universalidade da renda: cidadãos brasileiros são tributados sobre sua renda mundial, independentemente de onde ela seja gerada. Isso significa que os aluguéis recebidos em Dubai, mesmo que nunca toquem uma conta bancária no Brasil, estão sujeitos ao IRPF brasileiro. Entender essa regra desde o início é fundamental para um planejamento fiscal correto.</p>

<h2>Declaração do imóvel na ficha de Bens e Direitos</h2>
<p>Na Declaração de Ajuste Anual do Imposto de Renda Pessoa Física (DIRPF), o imóvel deve ser declarado na ficha "Bens e Direitos", grupo 15 (Bens imóveis localizados no exterior), código 15 (imóvel residencial) ou 16 (imóvel comercial/sala). O valor a informar é o custo de aquisição em reais, convertido pela taxa de câmbio de venda do dólar fixada pelo BCB na data da efetiva transferência do recurso. Se a compra foi realizada em AED (dirham), converta primeiro para USD e depois para BRL usando as taxas correspondentes.</p>

<p>Diferentemente dos imóveis no Brasil — que podem ser atualizados pelo valor de mercado com tributação específica —, imóveis no exterior são mantidos pelo custo histórico de aquisição em todos os anos subsequentes na DIRPF, sem atualização. Essa regra é vantajosa: ganho de capital entre o custo declarado e o preço de venda futura será tributado apenas no momento da alienação, não anualmente.</p>

<h2>Tributação dos rendimentos de aluguel no Brasil</h2>
<p>Os rendimentos mensais de aluguel recebidos em Dubai devem ser declarados mensalmente no Carnê-Leão — sistema de recolhimento mensal obrigatório para rendimentos de fontes no exterior. A alíquota segue a tabela progressiva do IRPF (7,5% a 27,5% dependendo do valor mensal). O pagamento do Carnê-Leão vence no último dia útil do mês seguinte ao do recebimento. Na DIRPF anual, esses rendimentos são consolidados na ficha "Rendimentos Tributáveis Recebidos de Fontes do Exterior".</p>

<ul>
  <li>Aluguel mensal até R$ 2.259,20: isento</li>
  <li>De R$ 2.259,21 a R$ 2.826,65: alíquota 7,5%</li>
  <li>De R$ 2.826,66 a R$ 3.751,05: alíquota 15%</li>
  <li>De R$ 3.751,06 a R$ 4.664,68: alíquota 22,5%</li>
  <li>Acima de R$ 4.664,68: alíquota 27,5%</li>
</ul>

<h2>Declaração CBE ao Banco Central</h2>
<p>Se o valor total de bens e direitos no exterior (somando imóveis, contas bancárias, investimentos) superar USD 1 milhão, o investidor deve apresentar ao BCB a Declaração de Capitais Brasileiros no Exterior (CBE) com periodicidade anual, no prazo fixado pelo BCB (geralmente até 5 de abril de cada ano). A CBE é distinta da DIRPF e exige informações detalhadas: endereço e descrição do imóvel, valor de mercado estimado, receita de aluguel gerada e dados do locatário. Omissão ou erro na CBE pode resultar em multa de até R$ 250 mil.</p>

<p>Para o contribuinte organizado, a declaração do imóvel em Dubai é perfeitamente gerenciável. A chave está em manter registros impecáveis: extratos bancários dos UAE em inglês, contratos de locação traduzidos, comprovantes de câmbio de todas as remessas e recibos de todas as despesas relacionadas ao imóvel (condomínio, manutenção, administração). Um contador com experiência em tributação de ativos no exterior é um investimento que se paga rapidamente, tanto pela segurança jurídica quanto pela identificação de deduções legais que reduzem a base tributável.</p>`,

  // [6] Marina District
  `<p>O Dubai Marina District é, hoje, uma das regiões mais densamente habitadas e dinamicamente valorizadas de Dubai. Desenvolvido ao longo de um canal artificial de 3,5 km escavado no deserto, o bairro nasceu nos anos 2000 e se tornou rapidamente o epicentro do lifestyle urbano de Dubai para expatriados e turistas de alto padrão. Com mais de 200 torres residenciais, uma marina para iates de luxo, o JBR (Jumeirah Beach Residence) e o Dubai Marina Walk — um boulevard de 7 km à beira-canal repleto de restaurantes, cafés e lojas —, o bairro combina qualidade de vida excepcional com rentabilidade imobiliária consistente.</p>

<h2>Por que Marina é o bairro favorito dos estrangeiros</h2>
<p>Marina District tem o maior volume de transações imobiliárias de Dubai há vários anos consecutivos — reflexo de sua liquidez excepcional. Qualquer imóvel bem conservado e bem precificado encontra comprador ou locatário em poucas semanas. Essa liquidez é especialmente valiosa para investidores que eventualmente desejam desinvestir: a saída de uma posição em Marina é significativamente mais rápida e previsível do que em bairros menos consolidados.</p>

<p>O perfil dos inquilinos é majoritariamente de profissionais de tecnologia, finanças e consultoria que trabalham no DIFC (Dubai International Financial Centre) ou JLT (Jumeirah Lakes Towers) — áreas a 10 a 15 minutos de carro. A concentração de empresas multinacionais nessas zonas garante demanda constante por apartamentos de qualidade próximos ao trabalho. Yields anuais de 7% a 9% são comuns para unidades de 1 e 2 quartos bem localizadas e geridas profissionalmente.</p>

<h2>Perfil de imóvel e estratégia de investimento</h2>
<p>Os apartamentos mais procurados em Marina são os de 1 e 2 quartos em edifícios com piscina, academia e vista para a marina ou para o mar. Studios também têm boa demanda no segmento de aluguel de curta duração (Airbnb e Booking.com), especialmente em temporada alta (outubro a abril). Torres icônicas como Princess Tower, Marina Gate e Cayan Tower têm filas de espera para aluguel e revenda, o que confirma a força da demanda. Preços médios de venda variam entre AED 1.800 e AED 2.500 por m², com ticket total entre AED 800 mil e AED 2,5 milhões dependendo do tamanho e posicionamento da unidade.</p>

<p>Para investidores brasileiros, Marina District representa uma entrada estratégica e balanceada no mercado de Dubai. O preço de entrada é significativamente menor do que Downtown ou Palm Jumeirah, a liquidez é altíssima, e o yield supera a média da cidade. A infraestrutura do bairro — metrô (estação Dubai Marina e DMCC), tramway costeiro, Marina Walk e acesso direto à praia — garante valorização estrutural independente de ciclos de mercado.</p>`,

  // [7] Visto Dourado processo
  `<p>O processo de obtenção do Golden Visa dos Emirados via investimento imobiliário é mais simples e rápido do que muitos brasileiros imaginam. Com a documentação correta e um imóvel registrado no DLD com valor mínimo de AED 2 milhões, o processo pode ser concluído em 30 a 45 dias. A simplicidade relativa do processo é um dos grandes diferenciais do programa: enquanto vistos de residência europeus exigem meses de espera e burocracia excessiva, o Golden Visa dos UAE pode ser obtido em cerca de um mês.</p>

<h2>Etapas detalhadas do processo</h2>
<p>A jornada começa antes mesmo da compra do imóvel: é fundamental escolher um imóvel elegível, ou seja, localizado em zona freehold, com valor de venda mínimo de AED 2 milhões e desenvolvedor ou vendedor com reputação comprovada. Após a compra e o registro no DLD, o comprador recebe o Title Deed — a escritura digital de propriedade que é o documento central para o pedido do Golden Visa. Com o Title Deed em mãos, solicita-se ao DLD o "Affection Letter" ou "Property Valuation Report", documento que confirma o valor de mercado do imóvel acima do mínimo exigido.</p>

<p>Em seguida, o processo migra para o GDRFA (General Directorate of Residency and Foreigners Affairs) de Dubai, acessível via plataforma digital ou presencialmente no Centro de Serviços. O requerente apresenta: passaporte válido, Title Deed, Affection Letter, foto biométrica e comprovante de seguro de saúde nos UAE. O exame médico — que inclui raio-X de tórax e exame de sangue para doenças infecciosas — é realizado em clínicas credenciadas pelo MOHAP (Ministry of Health and Prevention) espalhadas por Dubai, sem necessidade de agendamento com semanas de antecedência.</p>

<h2>Documentos necessários e taxas governamentais</h2>
<ul>
  <li>Passaporte válido (mínimo 6 meses de validade restante)</li>
  <li>Title Deed do imóvel emitido pelo DLD</li>
  <li>Property Affection Letter (valor confirmado acima de AED 2 mi)</li>
  <li>Resultado do exame médico (clínica credenciada MOHAP)</li>
  <li>Seguro de saúde válido nos UAE</li>
  <li>Foto biométrica (tirada no centro de serviços)</li>
  <li>Taxas governamentais: AED 2.800 a AED 4.000 por pessoa</li>
</ul>

<p>O Emirates ID — documento de identidade oficial dos residentes nos UAE — é emitido em até 10 dias úteis após a aprovação do Golden Visa. Com o Emirates ID, o investidor pode abrir contas bancárias como residente, contratar serviços de utilidade pública, matricular filhos em escolas e acessar todos os serviços governamentais digitais dos Emirados. O Golden Visa tem validade de 10 anos e é renovável indefinidamente, desde que o imóvel seja mantido em propriedade do titular.</p>`,

  // [8] Conta bancária Dubai
  `<p>Ter uma conta bancária nos Emirados Árabes Unidos é praticamente indispensável para o investidor brasileiro que adquire um imóvel em Dubai. Ela facilita o processo de compra, o recebimento de aluguéis, o pagamento de condomínio e serviços, e simplifica a eventual repatriação de recursos. A boa notícia é que abrir uma conta bancária em Dubai como estrangeiro — mesmo sem visto de residência — é possível, embora exija preparação e escolha cuidadosa do banco.</p>

<h2>Principais bancos e modalidades de conta</h2>
<p>O mercado bancário emiradense é robusto e regulado pelo UAE Central Bank. Para não-residentes, os bancos mais acessíveis são Emirates NBD (maior banco do UAE), RAKBANK (Ras Al Khaimah National Bank, com processo simplificado para estrangeiros) e Mashreq Bank (um dos mais antigos e com atendimento em português em algumas agências). Para residentes (pós-Golden Visa), a gama de opções se amplia: Abu Dhabi Commercial Bank (ADCB), First Abu Dhabi Bank (FAB) e Dubai Islamic Bank são alternativas populares.</p>

<p>As modalidades de conta disponíveis para brasileiros incluem: conta corrente em AED (para transações locais e pagamento de condomínios), conta em USD ou EUR (para transações internacionais e recebimento de aluguéis de estrangeiros) e conta de poupança com remuneração em dólar (típica em private banking para investidores com patrimônio acima de USD 500 mil). Saldos mínimos variam: contas básicas exigem AED 3.000 a AED 10.000; contas premium, AED 50.000 a AED 100.000.</p>

<h2>Documentação e processo de abertura para não-residentes</h2>
<p>Para abrir uma conta como não-residente (sem Golden Visa), os bancos emiradenses tipicamente solicitam: passaporte válido (com visto de entrada nos UAE — turístico ou de negócios é suficiente), comprovante de renda no Brasil (declaração de IR, holerite ou extrato bancário dos últimos 6 meses), comprovante de endereço no Brasil (conta de luz, água ou correspondência bancária recente), carta de referência bancária do banco principal no Brasil e, em alguns casos, o compromisso de compra do imóvel ou contrato com a incorporadora como proof of purpose. A presença física na agência em Dubai é geralmente necessária para assinatura de documentos e coleta biométrica.</p>

<p>Após a obtenção do Golden Visa, a conta de não-residente pode ser convertida em conta de residente, desbloqueando acesso a produtos mais completos: cartões de crédito internacionais (Visa Infinite, Mastercard World Elite), contas multidivisa, investimentos em fundos locais e serviços de private banking para investidores com patrimônio qualificado. Para brasileiros que receberão aluguéis mensais em Dubai, a configuração ideal é uma conta em AED para recebimentos locais e uma conta em USD para transações internacionais e eventual remessa de lucros de volta ao Brasil.</p>`,

  // [9] Tributação de imóveis em Dubai
  `<p>A tributação favorável é, sem dúvida, um dos maiores atrativos do mercado imobiliário de Dubai para investidores estrangeiros. Os Emirados Árabes Unidos adotam um modelo fiscal radicalmente diferente do brasileiro: não existe imposto de renda sobre pessoas físicas, o que significa que aluguéis recebidos, ganhos de capital na venda e dividendos de empresas locais são, em regra, isentos de tributação nos UAE. Essa característica, combinada com a estabilidade cambial do AED atrelado ao dólar desde 1997, cria um ambiente de acumulação patrimonial difícil de encontrar em qualquer outro mercado desenvolvido do mundo.</p>

<h2>O que o investidor NÃO paga nos UAE</h2>
<ul>
  <li>Imposto de renda sobre aluguel recebido: <strong>zero</strong></li>
  <li>Imposto sobre ganho de capital na venda do imóvel: <strong>zero</strong></li>
  <li>IPTU ou imposto anual sobre propriedade: <strong>zero</strong></li>
  <li>Imposto sobre herança ou transmissão: <strong>zero</strong></li>
  <li>Imposto sobre dividendos de empresas emiradenses: <strong>zero</strong> (para pessoa física)</li>
</ul>

<h2>Custos de transação e taxas obrigatórias</h2>
<p>Embora não haja impostos recorrentes, a compra de um imóvel em Dubai envolve custos de transação fixos que o investidor deve incorporar ao cálculo de rentabilidade. A taxa de registro no DLD (Dubai Land Department) é de 4% do valor de venda, paga no ato da transferência de propriedade — metade pelo comprador, metade pelo vendedor, salvo negociação contrária. Para imóveis acima de AED 2 milhões, essa taxa equivale a AED 80.000 ou mais, o que deve ser considerado no cálculo do break-even da operação.</p>

<p>Além da taxa do DLD, há as service charges (taxas de condomínio), que variam entre AED 10 e AED 30 por m² ao ano dependendo do empreendimento — o que representa, para um apartamento de 80 m², entre AED 800 e AED 2.400 anuais. Projetos de luxo em locais como Palm Jumeirah ou Downtown podem ter service charges mais altas, chegando a AED 40 por m². O valor exato é disponibilizado pelo desenvolvedor antes da compra e constará no Service Charge Schedule aprovado pelo DLD.</p>

<h2>Obrigações fiscais no Brasil: o que não muda</h2>
<p>A isenção fiscal nos UAE não elimina as obrigações tributárias brasileiras. O Brasil tributa seus cidadãos com base na universalidade da renda — ou seja, mesmo que o aluguel seja recebido em Dubai e permaneça em conta bancária emiradense, ele é tributável pelo IRPF brasileiro à alíquota de até 27,5%, com recolhimento mensal via Carnê-Leão. O ganho de capital na venda do imóvel, quando repatriado, está sujeito ao IRPF à alíquota de 15% a 22,5% dependendo do valor. Planejamento fiscal combinando a legislação brasileira e emiradense é essencial para otimizar a carga tributária total.</p>

<p>Em 2023, os UAE introduziram um Corporate Tax de 9% sobre lucros empresariais acima de AED 375 mil anuais — mas esse imposto afeta pessoas jurídicas que operam comercialmente nos UAE, não pessoas físicas que possuem imóveis como investimento. Se o investimento for estruturado por meio de uma holding ou empresa offshore, é recomendável consultar tributaristas especializados em ambas as jurisdições para garantir que a estrutura seja eficiente e conforme tanto com a legislação emiradense quanto com as regras brasileiras de Controlled Foreign Corporations (CFC).</p>`,

  // [10] O que são imóveis offplan
  `<p>O termo "offplan" — também chamado de "na planta" ou "pré-lançamento" — refere-se a imóveis vendidos antes da conclusão da obra, geralmente com base em plantas, maquetes, renderizações 3D e um prospecto detalhado do empreendimento. Em Dubai, o mercado offplan é excepcionalmente desenvolvido e representa, consistentemente, mais de 50% de todas as transações imobiliárias da cidade. Essa proporção reflete tanto a confiança dos investidores no ambiente regulatório quanto a sofisticação das incorporadoras locais, que oferecem planos de pagamento atrativos e produtos de alto padrão.</p>

<h2>Por que o offplan é tão popular em Dubai</h2>
<p>A principal razão é financeira: imóveis offplan são vendidos tipicamente com 10% a 20% de desconto em relação ao valor de mercado do imóvel pronto equivalente. Esse desconto compensa o risco de aguardar a entrega e remunera o comprador pelo financiamento antecipado da obra. Incorporadoras como Emaar, Damac, Sobha e Nakheel lançam projetos com payment plans que distribuem os pagamentos ao longo de 2 a 4 anos de construção — e, em alguns casos, incluem porcentagem significativa pós-entrega (post-handover payment plans), onde 40% a 50% do valor é pago após receber as chaves.</p>

<p>Outro atrativo é a flexibilidade de personalização: compradores offplan frequentemente podem escolher acabamentos, layouts alternativos e especificações premium durante a fase de construção. Isso é especialmente valioso para quem planeja vender ou alugar o imóvel após a entrega — unidades com acabamentos superiores alcançam preços de venda e aluguel significativamente maiores.</p>

<h2>Segurança jurídica: o sistema de escrow do DLD</h2>
<p>O maior medo de qualquer comprador de imóvel na planta é que a incorporadora abandone a obra ou entre em falência. Em Dubai, esse risco é mitigado por um sistema legal robusto: a lei emiradense obriga todas as incorporadoras que vendem imóveis offplan a abrir uma conta escrow exclusiva para cada projeto no DLD. Todos os pagamentos do comprador devem ser depositados nessa conta, e a incorporadora só pode sacar os recursos conforme o avanço verificado da obra — auditado por engenheiros credenciados pelo DLD. Isso significa que, se uma incorporadora parar as obras, os recursos dos compradores estão protegidos e disponíveis para devolução ou para contratar outro construtor para terminar o projeto.</p>

<ul>
  <li>Preços 10%-20% abaixo do mercado de imóveis prontos</li>
  <li>Pagamentos parcelados ao longo da obra (e frequentemente pós-entrega)</li>
  <li>Proteção via conta escrow supervisionada pelo DLD</li>
  <li>Potencial de revenda antes da entrega com lucro (flip)</li>
  <li>Escolha de acabamentos e personalizações durante a obra</li>
</ul>

<p>Para o investidor brasileiro, o offplan representa uma porta de entrada estratégica: ticket de entrada menor, parcelamento que facilita o fluxo de caixa, e potencial de valorização entre o preço de compra e o valor de mercado na entrega. A chave para o sucesso é a escolha criteriosa da incorporadora — dê preferência a desenvolvedores com histórico comprovado de entrega no prazo e conformidade com as especificações do projeto.</p>`,

  // [11] Downtown Dubai vs Business Bay
  `<p>Downtown Dubai e Business Bay são dois dos bairros mais disputados e valorizados do centro de Dubai. Separadas pelo Dubai Canal e pela Sheikh Zayed Road, as duas regiões competem diretamente por inquilinos executivos, compradores estrangeiros e investidores que buscam os melhores retornos do coração da cidade. A similaridade geográfica, no entanto, disfarça diferenças importantes em preço, perfil de comprador e potencial de retorno — diferenças que o investidor consciente precisa compreender antes de tomar sua decisão.</p>

<h2>Comparativo de preços, yield e perfil</h2>
<p>Downtown Dubai é o bairro mais premium e reconhecido de Dubai: home ao Burj Khalifa, ao Dubai Fountain e ao Dubai Mall, atrai compradores que pagam pela localização icônica e pelo reconhecimento de marca global. Preços médios por m² variam de AED 2.800 a AED 3.500, com apartamentos de 1 quarto a partir de AED 1,5 milhão. Os yields ficam entre 5% e 6,5% — menores do que a média da cidade, mas compensados pela alta liquidez na revenda e pela demanda sustentada de turistas e executivos de alto escalão.</p>

<p>Business Bay surgiu como o hub corporativo de Dubai e hoje concentra centenas de escritórios de empresas nacionais e internacionais, além de hotéis de luxo e uma comunidade residencial crescente. Os preços são mais acessíveis — AED 1.600 a AED 2.400 por m² — e os yields são consistentemente superiores: 6% a 7,5% para apartamentos de 1 e 2 quartos com vista para o Dubai Canal. A demanda por aluguel é impulsionada por profissionais que trabalham nas torres corporativas da região e preferem morar a 5 minutos do escritório.</p>

<h2>Qual escolher para investir em 2025?</h2>
<p>A resposta depende do perfil do investidor e do objetivo da operação. Para quem busca maximizar o yield e tem capital entre USD 350 mil e USD 550 mil, Business Bay oferece maior rentabilidade com menor ticket de entrada. Para quem prioriza liquidez premium na revenda, reconhecimento de marca internacional e está disposto a aceitar yield menor em troca de segurança na saída, Downtown é a escolha mais adequada. Investidores que elegibilidade ao Golden Visa (mínimo AED 2 mi) devem avaliar ambas as regiões, onde existem opções acima do valor mínimo.</p>

<p>Uma estratégia interessante adotada por alguns investidores é comprar em Business Bay com foco em yield de curto e médio prazo, e considerar Downtown como destino de uma eventual migração de portfólio quando o capital acumulado permitir. Ambas as regiões têm perspectivas positivas para 2025-2030, impulsionadas pelo crescimento populacional de Dubai e pelo aumento do turismo de negócios no centro da cidade.</p>`,

  // [12] Passaporte para o mundo
  `<p>A residência nos Emirados Árabes Unidos, obtida por meio do Golden Visa via investimento imobiliário, representa muito mais do que o direito de morar em Dubai. Para o brasileiro, o Emirates ID — o documento de identidade oficial dos residentes nos UAE — funciona como uma chave para um conjunto amplo de oportunidades globais que, de outra forma, seriam inacessíveis ou significativamente mais difíceis de acessar. Em um mundo onde mobilidade de capital e de pessoas é cada vez mais restrita, ter uma segunda residência em jurisdição sólida é um ativo estratégico de primeira ordem.</p>

<h2>Acesso a serviços bancários internacionais</h2>
<p>Uma das vantagens menos discutidas do Golden Visa dos UAE é a facilidade que ele proporciona para abertura de contas bancárias internacionais. Bancos suíços (UBS, Credit Suisse), britânicos (Barclays Private Bank, HSBC Premier) e singaporianos (DBS, OCBC) que normalmente recusam ou restringem serviços a clientes brasileiros por conta da reputação de compliance do Brasil aceitam residentes emiradenses com muito mais facilidade. O Emirates ID — especialmente quando associado a um visto de 10 anos — sinaliza aos bancos internacionais que o cliente passa por verificações rigorosas da autoridade emiradense, reduzindo a percepção de risco.</p>

<p>Isso abre acesso a contas multidivisa, plataformas de investimento globais (Euroclear, plataformas de ETFs americanos acessíveis apenas a residentes fora do Brasil), gestão de patrimônio offshore e instrumentos de planejamento sucessório que o investidor brasileiro simplesmente não consegue acessar com apenas o passaporte brasileiro. Para families com patrimônio acima de USD 1 milhão, essa abertura de serviços financeiros internacionais representa uma transformação significativa na capacidade de proteção e crescimento do capital.</p>

<h2>Mobilidade global e facilidade de vistos</h2>
<p>O passaporte brasileiro já concede acesso sem visto a aproximadamente 170 países — um documento poderoso por si só. A residência emiradense acrescenta credenciais que facilitam o processo de obtenção de vistos em países que exigem mais do que o passaporte: o Emirates ID é aceito como comprovante de residência estável em jurisdição regulada, o que acelera aprovações de vistos de longa duração (investidor, business) em países como Estados Unidos, Canadá, Reino Unido e Austrália. Famílias brasileiras que buscam alternativas de imigração para filhos estudantes relatam que a residência emiradense simplifica processos consulares.</p>

<p>Para famílias que pensam em mobilidade global de longo prazo, o Golden Visa dos UAE é uma das rotas mais eficientes e acessíveis disponíveis hoje. Em comparação com programas de residência europeus — que exigem permanência física mínima, tributação de renda mundial e burocracia extensa —, o Golden Visa dos UAE oferece máxima flexibilidade: o titular pode continuar vivendo no Brasil enquanto mantém a residência emiradense ativa, sem qualquer exigência de tempo mínimo nos Emirados. É uma plataforma de "plano B" que cada vez mais famílias brasileiras estão adotando como forma inteligente de proteção patrimonial e geopolítica.</p>`,

  // [13] Guia de bairros de Dubai
  `<p>Dubai é uma cidade que desafia qualquer tentativa de generalização. Em um território urbano de 4.114 km², convivem bairros ultramodernos às margens de canais artificiais, comunidades planejadas em pleno deserto, ilhas artificiais de ultra-luxo e centros corporativos com arranha-céus que rivalizam com os de Manhattan. Para o investidor brasileiro, entender a geografia e o perfil de cada bairro é o primeiro passo para identificar onde seu capital terá o melhor desempenho — considerando yield, valorização, liquidez e ticket de entrada.</p>

<h2>Os principais bairros por perfil de investidor</h2>
<p>Para o investidor conservador que prioriza liquidez e segurança na revenda, Downtown Dubai e Dubai Marina são as escolhas clássicas: mercados consolidados, altíssima demanda, boa infraestrutura e reconhecimento global. Para quem busca maximizar o yield e está disposto a apostar em bairros emergentes, Jumeirah Village Circle (JVC), Arjan e Dubai Sports City oferecem os maiores retornos da cidade — entre 7% e 10% ao ano — com tickets de entrada a partir de AED 500 mil. Dubai South e Dubai Creek Harbour são apostas de médio e longo prazo, com potencial expressivo de valorização ligado ao desenvolvimento do aeroporto Al Maktoum e ao projeto do Dubai Creek Tower.</p>

<p>Palm Jumeirah permanece o endereço mais exclusivo e simbólico de Dubai. Villas nas fronds da palmeira e apartamentos em torres como One Palm e Atlantis The Royal definem o segmento de ultra-luxo, com tickets acima de AED 5 milhões e yields menores (3%-5%), mas com apreciação de capital que mais do que compensa no longo prazo. Business Bay e DIFC atendem o investidor que busca alta ocupação corporativa e yield consistente em imóveis de 1 e 2 quartos.</p>

<h2>Recomendações por nível de capital disponível</h2>
<ul>
  <li><strong>AED 500 mil a AED 800 mil (USD 136 mil a USD 218 mil):</strong> JVC, Arjan, Dubai Sports City — yield máximo, mercado em crescimento</li>
  <li><strong>AED 800 mil a AED 1,5 mi (USD 218 mil a USD 408 mil):</strong> Dubai Marina, JLT — equilíbrio entre yield e liquidez</li>
  <li><strong>AED 1,5 mi a AED 2,5 mi (USD 408 mil a USD 680 mil):</strong> Business Bay, Downtown Dubai — elegibilidade para Golden Visa, liquidez premium</li>
  <li><strong>Acima de AED 2,5 mi (USD 680 mil+):</strong> Palm Jumeirah, Emirates Hills, Dubai Hills Estate — valorização patrimonial de longo prazo</li>
</ul>

<p>Para o brasileiro estreando no mercado de Dubai, a recomendação consistente dos especialistas é começar por bairros consolidados com alta liquidez — Dubai Marina ou Business Bay são as escolhas mais equilibradas para um primeiro imóvel. Após compreender a dinâmica do mercado local e construir uma rede de contatos (agentes, gestores de propriedade, contadores), a diversificação para outros bairros com diferentes perfis de retorno é o caminho natural para construir um portfólio imobiliário robusto e diversificado nos Emirados Árabes Unidos.</p>`,
]

export const PLACEHOLDER_POSTS: WPPost[] = LATEST_META.map((m, i) => ({
  id:         i + 1,
  slug:       `artigo-exemplo-${i + 1}`,
  title:      { rendered: m.title },
  excerpt:    { rendered: `<p>${m.excerpt}</p>` },
  content:    { rendered: PLACEHOLDER_CONTENT[i] ?? '<p>Conteúdo completo do artigo aqui.</p>' },
  date:       m.date,
  modified:   new Date().toISOString(),
  categories: [m.cat.id],
  meta:       { dubai_audio_file: '', dubai_audio_title: 'Episódio de exemplo' },
  _embedded: {
    'wp:featuredmedia': [{ source_url: `/imagens/dubai${(i % 10) + 1}.webp`, alt_text: m.title }],
    'wp:term': [[m.cat]],
  },
}))

// ── Conteúdo dos posts de Vendas ─────────────────────────────────────────────
const VENDAS_CONTENT: string[] = [
  // [0] Guia do Investidor Brasileiro em Dubai 2025
  `<p>O mercado imobiliário de Dubai vive um momento histórico. Em 2024, o volume de transações ultrapassou AED 500 bilhões — um recorde absoluto —, e as perspectivas para 2025 são ainda mais promissoras, impulsionadas por novos projetos de infraestrutura, crescimento populacional sustentado e fluxo constante de investidores internacionais, incluindo um número crescente de brasileiros.</p>

<h2>Por que 2025 é um ano estratégico para entrar no mercado</h2>
<p>Dubai encerrou 2024 como o mercado imobiliário de maior crescimento entre as grandes cidades globais, com valorização média de 15% nos preços de venda e ocupação de longo prazo acima de 92%. Para o investidor brasileiro, a janela atual é particularmente interessante por uma confluência de fatores: dólar americano forte frente ao real, lançamentos de pré-venda com planos de pagamento flexíveis e yields de aluguel que continuam superiores aos de mercados como Londres, Lisboa e Miami.</p>

<p>O perfil do investidor brasileiro também evoluiu. Se nos primeiros anos o interesse era majoritariamente de ultra-high-net-worth individuals com tickets acima de USD 1 milhão, hoje vemos um crescimento expressivo de investidores de alta renda média — médicos, empresários, executivos e profissionais liberais — com capital entre USD 150.000 e USD 500.000, interessados em diversificação cambial e renda passiva em moeda forte.</p>

<h2>Os segmentos mais atrativos em 2025</h2>
<p><strong>Apartamentos de 1 e 2 quartos para aluguel de longo prazo:</strong> São o ponto de entrada mais eficiente para o investidor novo. Regiões como JVC, Dubai Marina e Business Bay concentram a maioria das transações nesse perfil. O yield médio está entre 7% e 9,5% ao ano, com ocupação consistente ao longo do ano inteiro.</p>

<p><strong>Imóveis off-plan de construtoras premium:</strong> Emaar, Nakheel, DAMAC e Sobha lançaram no primeiro semestre de 2025 projetos com pagamento de 80% após a entrega — um modelo que reduz drasticamente o capital imobilizado durante a obra. Para o investidor com visão de médio prazo (2 a 4 anos), esses lançamentos oferecem potencial de valorização de 20% a 40% entre o lançamento e a entrega.</p>

<p><strong>Villas e townhouses em comunidades planejadas:</strong> Arabian Ranches, Dubai Hills Estate e Damac Hills atendem famílias e expatriados de alta renda que preferem alugar a comprar. O yield é menor (4%-6%), mas a valorização de capital tem sido expressiva e o perfil de inquilino é de baixíssimo risco de inadimplência.</p>

<h2>O processo de compra em 6 etapas</h2>
<p>Para o brasileiro comprando pela primeira vez em Dubai, o processo segue estas etapas principais: (1) abertura de conta bancária nos UAE ou definição de banco correspondente para remessa; (2) escolha do imóvel e negociação do MOU (Memorandum of Understanding); (3) pagamento da reserva (tipicamente 10%); (4) due diligence legal com advogado especializado em RERA; (5) registro no DLD (Dubai Land Department) e emissão do título de propriedade; (6) setup do contrato de administração para locação, se aplicável.</p>

<p>O prazo total, do fechamento do MOU ao recebimento do título definitivo (Title Deed), é geralmente de 30 a 45 dias para imóveis prontos. Para imóveis off-plan, o Title Deed é emitido na conclusão da obra, que pode levar de 18 meses a 4 anos dependendo do projeto.</p>

<h2>O que monitorar ao longo de 2025</h2>
<p>Acompanhe os índices do Dubai Land Department e o relatório trimestral do RERA para entender a dinâmica de cada subm mercado. Atenção especial ao impacto do Dubai 2040 Urban Master Plan, que vai concentrar novos investimentos em corredores específicos e tende a criar zonas de valorização acelerada. O acompanhamento constante dessas tendências — exatamente o que o Dubai Imóveis oferece — é o diferencial do investidor que maximiza o retorno no longo prazo.</p>`,

  // [1] O icônico monumento de Dubai acaba de ser vendido para o Fundo IMP
  `<p>Em uma transação que surpreendeu o mercado imobiliário global, um dos monumentos mais icônicos do skyline de Dubai foi adquirido pelo Fundo de Investimento Imobiliário IMP em um negócio avaliado em AED 2,3 bilhões — aproximadamente USD 630 milhões. A operação, concluída em maio de 2025, representa um dos maiores negócios individuais já registrados pelo Dubai Land Department e sinaliza o apetite crescente de fundos institucionais pelo mercado emiradense.</p>

<h2>Os detalhes da transação</h2>
<p>O IMP Real Estate Fund, com sede em Abu Dhabi e gestão de portfólio global, adquiriu a propriedade após meses de negociações confidenciais. O fundo tem histórico de investimentos em ativos emblemáticos em mercados como Londres, Cingapura e Nova York, e a entrada em Dubai marca sua primeira aquisição no Golfo. Fontes próximas à negociação indicaram que a valorização projetada está entre 18% e 25% em cinco anos, com planos de retrofit e reposicionamento do ativo para uso misto (corporativo + hotelaria de luxo).</p>

<p>Para o mercado como um todo, a transação tem um efeito de sinalização poderoso: quando fundos institucionais de renome global alocam capital em ativos prime de Dubai, o mercado interpreta isso como validação da tese de valorização de longo prazo. Nos últimos 18 meses, o número de transações acima de AED 100 milhões por fundos internacionais cresceu 43%, segundo dados do DLD.</p>

<h2>O que isso significa para o investidor pessoa física</h2>
<p>O movimento institucional tende a comprimir os yields de ativos prime, mas ao mesmo tempo eleva o piso de preço dos imóveis residenciais nas áreas adjacentes. Quando um fundo de grande porte compra e repositiona um ativo emblemático em determinada região, o efeito de arrastamento nos apartamentos e villas vizinhos costuma ser rápido e consistente. Para o investidor pessoa física que já tem posição em áreas próximas ao imóvel adquirido pelo IMP, a notícia é positiva para a valorização do portfólio.</p>

<p>Para quem ainda não entrou no mercado, a lição é clara: os preços de ativos prime de Dubai já refletem a demanda global, e a janela de entrada com valuations mais acessíveis está se estreitando em algumas regiões. Bairros emergentes como Dubai South e Jumeirah Village Triangle ainda oferecem preços de entrada mais baixos com alto potencial de valorização — e é exatamente nesses mercados que o investidor de capital menor pode encontrar os melhores retornos ajustados ao risco nos próximos anos.</p>`,

  // [2] Praias de Dubai recebem 20% mais visitantes em 2026
  `<p>O relatório anual de turismo do Dubai Tourism Board revelou que as praias da cidade receberam 20% mais visitantes no primeiro semestre de 2026 em comparação com o mesmo período do ano anterior — um crescimento que coloca Dubai no topo das destinações de turismo costeiro no Oriente Médio e que tem implicações diretas para o mercado imobiliário, especialmente no segmento de aluguel de curta temporada.</p>

<h2>Por que o turismo de praias cresceu tanto</h2>
<p>Vários fatores confluíram para esse crescimento expressivo. A expansão das rotas da Emirates e da Flydubai conectou novas cidades europeias, asiáticas e latino-americanas a Dubai sem escalas. O projeto de revitalização das praias públicas — com novos parques aquáticos, infraestrutura gastronômica e eventos musicais — atraiu um perfil de turista diferente do tradicional visitante de shoppings e arranha-céus. E o impacto climático global, que tornou destinos mediterrâneos ainda mais quentes e desgastantes no verão, redirecionou fluxo turístico para Dubai nos meses de novembro a abril.</p>

<p>As praias mais procuradas seguem sendo Jumeirah Beach (JBR), Kite Beach e La Mer — todas em áreas com alta concentração de imóveis residenciais de aluguel de curta temporada. Segundo dados da plataforma Airbnb e da DTCM (Dubai Tourism and Commerce Marketing), a taxa de ocupação média de apartamentos frente ao mar nessas áreas durante a alta temporada (outubro-março) foi de 94% em 2025-2026, com diárias médias de USD 280 para estúdios e USD 450 para apartamentos de 1 quarto.</p>

<h2>Impacto no mercado de short-term rental</h2>
<p>Para o investidor imobiliário, o crescimento do turismo de praias reforça a tese do short-term rental (STR) em apartamentos costeiros. Dubai permite o aluguel de curta temporada mediante registro na plataforma Holiday Homes do DTCM — um processo simples que, uma vez concluído, permite ao proprietário operar legalmente via Airbnb, Booking e plataformas similares. A regulação é um diferencial importante: Dubai é uma das poucas cidades do mundo onde o STR é amplamente permitido e bem regulado, ao contrário de Lisboa, Barcelona e Nova York, que impuseram restrições severas nos últimos anos.</p>

<p>A combinação de alta demanda turística, regulação favorável e yields de STR que podem superar 12% ao ano no pico da temporada faz de Dubai uma das poucas cidades do mundo onde o modelo de rental arbitrage — comprar ou alugar de longo prazo e sublocar em curta temporada — ainda funciona com margem positiva consistente. Para o brasileiro que busca maximizar o retorno sobre o capital investido, essa estratégia merece atenção e estudo aprofundado.</p>`,

  // [3] Downtown vs Dubai Marina vs Palm Jumeirah: onde o ROI é maior em 2025?
  `<p>A pergunta que mais recebemos de investidores brasileiros que estão avaliando seu primeiro imóvel em Dubai é simples e direta: onde colocar o dinheiro? Downtown Dubai, Dubai Marina e Palm Jumeirah são os três endereços mais conhecidos internacionalmente — e cada um tem características distintas de perfil de retorno, liquidez e ticket de entrada que influenciam diretamente na decisão de investimento. Nesta análise, comparamos os três bairros com dados de 2025 para ajudar você a tomar a decisão mais alinhada ao seu perfil.</p>

<h2>Downtown Dubai: o endereço mais caro, mas também o mais líquido</h2>
<p>Downtown é o centro simbólico de Dubai — o Burj Khalifa, o Dubai Mall e a Dubai Fountain estão todos aqui. Isso faz de Downtown o endereço mais reconhecível globalmente e, consequentemente, um dos mais líquidos quando você quiser vender. O preço médio por metro quadrado em 2025 está em AED 3.800 (aproximadamente USD 1.035/m²), e o yield de aluguel para apartamentos de 1 quarto é de 5,5% a 6,5% — menor do que bairros emergentes, mas com resiliência de preço notável mesmo em ciclos de baixa.</p>

<p>O perfil de locatário é predominantemente executivo e corporativo, o que significa locações de longo prazo, baixa rotatividade e inadimplência praticamente inexistente. Para o investidor com capital entre AED 1,5 mi e AED 3 mi (USD 400k-800k) que prioriza segurança, liquidez e uma âncora de portfólio em endereço prime, Downtown é a escolha mais defensiva e ao mesmo tempo mais valorizada.</p>

<h2>Dubai Marina: o equilíbrio perfeito entre yield e valorização</h2>
<p>Dubai Marina é consistentemente o bairro mais transacionado de Dubai há mais de uma década. A combinação de marina artificial, promenade com 7 km de extensão, opções gastronômicas de alto nível e proximidade da praia (JBR fica a 10 minutos a pé) cria um produto que agrada tanto ao locatário de longo prazo quanto ao turista de curta temporada. Em 2025, o yield médio de apartamentos de 1 quarto na Marina está em 6,8% a 8% — acima de Downtown — com preço médio de AED 2.600/m² (USD 708/m²).</p>

<p>O grande diferencial da Marina em 2025 é o potencial de apreciação impulsionado pelo projeto Blue Line Metro, que vai adicionar novas estações na região e aumentar significativamente a acessibilidade. Historicamente, a valorização de imóveis no raio de 500 metros de estações de metro em Dubai foi de 18% a 25% nos 12 meses seguintes à inauguração. Para o investidor que compra hoje, antes da conclusão do projeto prevista para 2029, o timing de entrada é estrategicamente favorável.</p>

<h2>Palm Jumeirah: capital preservation e status, não yield</h2>
<p>Palm Jumeirah é o endereço de ultra-luxo de Dubai. O Palm Residence Index — indicador que acompanha exclusivamente as propriedades na ilha artificial — registrou valorização de 22% em 2024 e 31% em 2023, colocando a Palm entre os ativos imobiliários de melhor desempenho no mundo nesse período. O ticket mínimo para um apartamento nas fronds começa em AED 2,8 mi (USD 760k), e villas de 4 quartos nas Signature Villas ultrapassam facilmente AED 25 mi (USD 6,8 mi).</p>

<p>O yield de aluguel, entretanto, não é o ponto forte da Palm: estúdios e 1-quarto rendem entre 4% e 5,5% ao ano, abaixo da média do mercado. A estratégia aqui é diferente: o investidor da Palm não está comprando yield — está comprando escassez, status e valorização de capital de longo prazo. O produto é finito (não há mais terra disponível na ilha), a demanda é global e o perfil de comprador tende a ser o ultra high net worth individual que usa o imóvel também para residência ou second home.</p>

<h2>O veredicto: qual escolher?</h2>
<p>Não existe resposta única — a escolha depende do seu perfil, capital e objetivo. Se você quer maximizar yield com capital entre USD 200k e USD 500k, Dubai Marina é a melhor opção. Se quer âncora de portfólio em endereço líquido e defensivo com capital entre USD 400k e USD 800k, Downtown é a escolha. Se tem capital acima de USD 750k e prioriza valorização patrimonial de longo prazo com baixa volatilidade, Palm Jumeirah faz sentido. Em todos os casos, os fundamentos de Dubai — crescimento populacional, demanda de aluguel sustentada e regulação favorável ao investidor estrangeiro — continuam robustos para os próximos anos.</p>`,
]

const VENDAS_META = [
  { title: 'Guia do Investidor Brasileiro em Dubai 2025',                               date: '2026-05-08T10:00:00.000Z', cat: { id: 7,  name: 'Criativos',   slug: 'criativos',   count: 3 } },
  { title: 'O icônico monumento de Dubai acaba de ser vendido para o Fundo IMP',        date: '2026-05-06T10:00:00.000Z', cat: { id: 8,  name: 'Vendas',      slug: 'vendas',      count: 9 } },
  { title: 'Praias de Dubai recebem 20% mais visitantes que no ano de 2026',            date: '2026-05-04T10:00:00.000Z', cat: { id: 9,  name: 'Turismo',     slug: 'turismo',     count: 4 } },
  { title: 'Downtown vs Dubai Marina vs Palm Jumeirah: onde o ROI é maior em 2025?',   date: '2026-05-01T10:00:00.000Z', cat: { id: 10, name: 'Construções', slug: 'construcoes', count: 3 } },
]

export const PLACEHOLDER_VENDAS_POSTS: WPPost[] = VENDAS_META.map((m, i) => ({
  id:         100 + i,
  slug:       `venda-exemplo-${i + 1}`,
  title:      { rendered: m.title },
  excerpt:    { rendered: '<p>Análise detalhada com dados de mercado para investidores brasileiros no Dubai.</p>' },
  content:    { rendered: VENDAS_CONTENT[i] ?? '<p>Conteúdo em breve.</p>' },
  date:       m.date,
  modified:   new Date().toISOString(),
  categories: [m.cat.id],
  meta:       { dubai_audio_file: '', dubai_audio_title: m.title },
  _embedded: {
    'wp:featuredmedia': [{ source_url: `/imagens/dubai${i + 7}.webp`, alt_text: m.title }],
    'wp:term': [[m.cat]],
  },
}))

export const PLACEHOLDER_CATEGORIES: WPCategory[] = [
  { id: 1,  name: 'Investimento',  slug: 'investimento',  count: 12 },
  { id: 2,  name: 'Regiões',       slug: 'regioes',       count: 8  },
  { id: 3,  name: 'Visto Dourado', slug: 'visto-dourado', count: 5  },
  { id: 4,  name: 'Jurídico',      slug: 'juridico',      count: 7  },
  { id: 6,  name: 'Comparativo',   slug: 'comparativo',   count: 4  },
  { id: 7,  name: 'Criativos',     slug: 'criativos',     count: 3  },
  { id: 8,  name: 'Vendas',        slug: 'vendas',        count: 9  },
  { id: 9,  name: 'Turismo',       slug: 'turismo',       count: 4  },
  { id: 10, name: 'Construções',   slug: 'construcoes',   count: 3  },
  { id: 11, name: 'Dolarização',   slug: 'dolarizacao',   count: 6  },
  { id: 12, name: 'Transferência', slug: 'transferencia', count: 5  },
  { id: 13, name: 'Declaração',    slug: 'declaracao',    count: 4  },
]
