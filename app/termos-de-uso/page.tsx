import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso — Dubai Imóveis',
  description: 'Leia os termos e condições de uso do portal Dubai Imóveis antes de acessar nosso conteúdo.',
}

export default function TermosDeUso() {
  return (
    <div className="legal-page">
      <div className="container">
        <header className="legal-header">
          <h1 className="legal-title">Termos de Uso</h1>
          <p className="legal-updated">Atualizado em: 1 de janeiro de 2025</p>
        </header>
        <div className="legal-body">
          <div className="legal-section">
            <h2>1. Aceitação dos termos</h2>
            <p>
              Ao acessar ou utilizar o portal <strong>Dubai Imóveis</strong>, você concorda com
              estes Termos de Uso e com nossa Política de Privacidade. Se você não concorda com
              qualquer disposição destes termos, não utilize nossos serviços. O uso continuado do
              portal após alterações nos termos implica aceitação das modificações.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Natureza do conteúdo</h2>
            <p>
              O Dubai Imóveis é um portal editorial de conteúdo informativo sobre o mercado
              imobiliário dos Emirados Árabes Unidos. Todo o conteúdo publicado tem caráter
              exclusivamente jornalístico e educacional, não constituindo assessoria de investimentos,
              recomendação de compra ou venda de ativos imobiliários, nem consultoria jurídica,
              fiscal ou financeira de qualquer natureza.
            </p>
            <p>
              As informações publicadas são obtidas de fontes consideradas confiáveis, mas o portal
              não garante sua exatidão, completude ou atualidade. Sempre consulte profissionais
              habilitados — corretores licenciados pelo RERA, advogados e consultores financeiros
              — antes de tomar qualquer decisão de investimento.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Uso permitido</h2>
            <p>O acesso ao portal é gratuito e concedido para uso pessoal e não comercial. É vedado:</p>
            <ul>
              <li>Reproduzir, distribuir ou comercializar o conteúdo editorial sem autorização prévia
              e escrita do Dubai Imóveis;</li>
              <li>Utilizar robôs, scrapers ou qualquer tecnologia automatizada para extrair conteúdo
              do portal;</li>
              <li>Publicar ou transmitir material ilegal, difamatório, ofensivo ou que viole direitos
              de terceiros;</li>
              <li>Tentar acessar áreas restritas do portal ou comprometer sua segurança ou
              desempenho;</li>
              <li>Utilizar o conteúdo do portal para induzir terceiros a decisões de investimento
              sem as devidas qualificações profissionais.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Propriedade intelectual</h2>
            <p>
              Todo o conteúdo publicado no portal — incluindo textos, imagens, logotipos, gráficos,
              layout e código-fonte — é protegido por direitos autorais e de propriedade intelectual.
              A reprodução parcial de trechos do conteúdo é permitida para fins de citação ou
              referência jornalística, desde que a fonte seja devidamente atribuída com link para o
              artigo original.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Links externos</h2>
            <p>
              O portal pode conter links para sites de terceiros. Esses links são fornecidos apenas
              para conveniência do leitor. O Dubai Imóveis não endossa nem é responsável pelo
              conteúdo, políticas de privacidade ou práticas de sites externos. O acesso a qualquer
              site externo é feito por conta e risco do usuário.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Limitação de responsabilidade</h2>
            <p>
              O Dubai Imóveis não se responsabiliza por decisões de investimento, perdas financeiras,
              danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso das
              informações publicadas no portal. Para uma análise completa de qualquer investimento
              imobiliário, consulte profissionais especializados e regulados pelas autoridades
              competentes.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Alterações nos termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As
              alterações entram em vigor imediatamente após a publicação da versão atualizada no
              portal. Recomendamos que você revise estes termos periodicamente. A data da última
              atualização está indicada no início deste documento.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Lei aplicável e foro</h2>
            <p>
              Estes Termos de Uso são regidos pela legislação brasileira. Quaisquer disputas
              decorrentes ou relacionadas ao uso do portal serão submetidas ao foro da comarca de
              São Paulo, Estado de São Paulo, com exclusão de qualquer outro, por mais privilegiado
              que seja.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
