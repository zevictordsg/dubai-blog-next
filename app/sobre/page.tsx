import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós — Dubai Imóveis',
  description: 'Conheça a equipe editorial do Dubai Imóveis, o guia definitivo para brasileiros que desejam investir com segurança no mercado imobiliário dos Emirados Árabes Unidos.',
}

export default function SobrePage() {
  return (
    <div className="legal-page">
      <div className="container">
        <header className="legal-header">
          <h1 className="legal-title">Sobre o Dubai Imóveis</h1>
          <p className="legal-updated">O guia definitivo para brasileiros no mercado imobiliário dos Emirados</p>
        </header>

        <div className="legal-body">

          {/* Quem somos */}
          <section id="quem-somos" className="legal-section">
            <h2>Quem somos</h2>
            <p>
              O Dubai Imóveis é um portal editorial independente fundado por brasileiros com experiência direta no mercado imobiliário dos Emirados Árabes Unidos. Nascemos da percepção de que, apesar do crescente interesse dos brasileiros em investir em Dubai, havia uma lacuna enorme de conteúdo em português — claro, confiável e baseado em dados reais — sobre como navegar esse mercado com segurança.
            </p>
            <p>
              Não somos corretora de imóveis nem intermediária de transações. Somos um veículo editorial independente: nosso negócio é produzir jornalismo especializado de alto padrão sobre o mercado imobiliário de Dubai, com foco exclusivo no público brasileiro. Nossa receita vem de parcerias editoriais transparentes, não de comissões de vendas — o que garante a independência e a imparcialidade do nosso conteúdo.
            </p>
          </section>

          {/* Nossa missão */}
          <section id="missao" className="legal-section">
            <h2>Nossa missão</h2>
            <p>
              Democratizar o acesso à informação de qualidade sobre o mercado imobiliário de Dubai para investidores brasileiros. Acreditamos que toda pessoa capaz de fazer um investimento internacional merece ter acesso ao mesmo nível de informação que os grandes investidores institucionais possuem — sem jargão excessivo, sem informações vagas e sem viés de venda disfarçado de conteúdo editorial.
            </p>
            <p>
              Nossa missão se desdobra em três frentes: educar o investidor brasileiro sobre como funciona o mercado de Dubai (regulação, tributação, processo de compra, gestão de propriedade); alertar sobre riscos reais e estratégias inadequadas ao perfil do investidor; e conectar nossos leitores com os melhores recursos disponíveis — profissionais especializados, dados de mercado atualizados e análises independentes.
            </p>
          </section>

          {/* Equipe editorial */}
          <section id="equipe" className="legal-section">
            <h2>Equipe editorial</h2>
            <p>
              Nossa equipe é composta por jornalistas especializados em mercado imobiliário internacional, analistas com experiência em real estate nos Emirados Árabes Unidos e consultores jurídicos familiarizados com a legislação tanto brasileira quanto emiradense. Todos os membros da equipe passaram por Dubai e têm experiência prática — não apenas teórica — com os processos que descrevemos em nosso conteúdo.
            </p>
            <p>
              Todo artigo publicado no Dubai Imóveis passa por um processo de revisão editorial que inclui verificação de dados, atualização com base nas mudanças regulatórias mais recentes e revisão por pelo menos um especialista com experiência no tema abordado. Não publicamos conteúdo gerado automaticamente sem revisão humana qualificada.
            </p>
          </section>

          {/* Valores editoriais */}
          <section id="valores" className="legal-section">
            <h2>Valores editoriais</h2>
            <p>
              <strong>Independência:</strong> não recebemos comissões de vendas de imóveis, incorporadoras ou agências imobiliárias. Parcerias comerciais são claramente identificadas como conteúdo patrocinado e mantidas separadas do conteúdo editorial.
            </p>
            <p>
              <strong>Precisão:</strong> citamos nossas fontes, datamos nossas informações e revisamos regularmente artigos mais antigos para manter a atualidade. Se cometemos um erro, publicamos uma correção clara e transparente.
            </p>
            <p>
              <strong>Acessibilidade:</strong> escrevemos para o investidor pessoa física, não para o especialista de mercado. Explicamos termos técnicos, contextualizamos dados e evitamos jargão desnecessário. Nosso padrão é: se um leitor inteligente mas sem experiência em imóveis internacionais não entendeu, precisamos reescrever.
            </p>
            <p>
              <strong>Responsabilidade:</strong> investimento imobiliário no exterior envolve riscos reais e obrigações legais sérias. Nunca minimizamos riscos para tornar um artigo mais atraente. Recomendamos sempre a consulta a profissionais especializados — advogados, contadores e agentes imobiliários licenciados — antes de qualquer decisão de investimento.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
