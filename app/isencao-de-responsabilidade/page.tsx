import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Isenção de Responsabilidade — Dubai Imóveis',
  description: 'As informações publicadas no Dubai Imóveis têm caráter exclusivamente editorial e não constituem assessoria jurídica, fiscal ou de investimentos.',
}

export default function IsencaoDeResponsabilidade() {
  return (
    <div className="legal-page">
      <div className="container">
        <header className="legal-header">
          <h1 className="legal-title">Isenção de Responsabilidade</h1>
          <p className="legal-updated">Atualizado em: 1 de janeiro de 2025</p>
        </header>
        <div className="legal-body">

          <div className="legal-section">
            <h2>1. Natureza do conteúdo</h2>
            <p>
              O portal <strong>Dubai Imóveis</strong> é um veículo editorial de jornalismo especializado em mercado imobiliário internacional.
              Todo o conteúdo publicado — artigos, análises, guias, relatórios e demais materiais — tem caráter exclusivamente informativo e educacional.
            </p>
            <p>
              As informações veiculadas não constituem, em nenhuma hipótese, assessoria jurídica, tributária, financeira ou de investimentos.
              Para decisões dessa natureza, o leitor deve consultar profissionais habilitados.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Não configura oferta de investimento</h2>
            <p>
              Nenhum artigo, análise de mercado, projeção de retorno (ROI), comparativo de bairros ou qualquer outro conteúdo publicado neste portal
              deve ser interpretado como oferta, recomendação, indução ou sugestão de compra, venda ou manutenção de ativos, sejam eles imobiliários,
              financeiros ou de qualquer outra natureza.
            </p>
            <p>
              Dados de rentabilidade, valorização histórica e projeções apresentados em nossos artigos são baseados em fontes de mercado disponíveis
              publicamente e têm finalidade ilustrativa. Rentabilidade passada não é garantia de rentabilidade futura.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Precisão das informações</h2>
            <p>
              Embora a equipe editorial do Dubai Imóveis se empenhe em verificar a precisão, atualidade e completude das informações publicadas,
              não garantimos que o conteúdo esteja livre de imprecisões, erros tipográficos ou desatualizações decorrentes de mudanças na legislação,
              no mercado ou em outras fontes externas.
            </p>
            <p>
              A legislação dos Emirados Árabes Unidos, as regras do Banco Central do Brasil relativas a remessas internacionais e as obrigações
              fiscais do contribuinte brasileiro titular de bens no exterior estão sujeitas a alterações que podem não estar refletidas imediatamente
              em nosso conteúdo.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Responsabilidade do leitor</h2>
            <p>
              O leitor é o único responsável pelas decisões tomadas com base nas informações obtidas neste portal.
              O Dubai Imóveis, seus editores, colaboradores e parceiros comerciais não se responsabilizam por perdas, danos diretos ou indiretos,
              prejuízos financeiros ou quaisquer outras consequências decorrentes do uso ou aplicação das informações aqui publicadas.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Consulte profissionais habilitados</h2>
            <p>
              Antes de realizar qualquer investimento imobiliário no exterior, especialmente nos Emirados Árabes Unidos, recomendamos enfaticamente
              que o leitor consulte:
            </p>
            <ul>
              <li>Advogado especializado em direito imobiliário internacional;</li>
              <li>Consultor tributário com expertise em legislação de bens no exterior (DIRPF, BACEN CBE);</li>
              <li>Assessor de câmbio habilitado pelo Banco Central do Brasil;</li>
              <li>Agente imobiliário licenciado pela RERA (Real Estate Regulatory Agency) dos Emirados.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Links externos</h2>
            <p>
              Este portal pode conter links para sites, portais e plataformas de terceiros. O Dubai Imóveis não endossa,
              não controla e não se responsabiliza pelo conteúdo, práticas de privacidade ou políticas comerciais de sites externos.
              O acesso a esses recursos é de inteira responsabilidade do usuário.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Atualização deste aviso</h2>
            <p>
              Esta Isenção de Responsabilidade pode ser atualizada a qualquer momento sem aviso prévio. A data de revisão mais recente
              está indicada no topo desta página. O uso continuado do portal após eventuais atualizações implica aceitação dos termos revisados.
            </p>
            <p>
              Dúvidas? Entre em contato: <a href="mailto:contato@dubaimoveis.com" style={{ color: 'var(--gold)', fontWeight: 600 }}>contato@dubaimoveis.com</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
