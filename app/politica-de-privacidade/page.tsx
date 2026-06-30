import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Dubai Imóveis',
  description: 'Saiba como coletamos, usamos e protegemos seus dados pessoais no portal Dubai Imóveis.',
}

export default function PoliticaDePrivacidade() {
  return (
    <div className="legal-page">
      <div className="container">
        <header className="legal-header">
          <h1 className="legal-title">Política de Privacidade</h1>
          <p className="legal-updated">Atualizado em: 1 de janeiro de 2025</p>
        </header>
        <div className="legal-body">
          <div className="legal-section">
            <h2>1. Quem somos</h2>
            <p>
              O portal <strong>Dubai Imóveis</strong> é um veículo editorial independente dedicado a
              informar brasileiros sobre o mercado imobiliário dos Emirados Árabes Unidos. Nosso
              compromisso é com a transparência no tratamento de dados pessoais, em conformidade com
              a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Dados que coletamos</h2>
            <p>Coletamos apenas os dados necessários para oferecer nossos serviços editoriais e de
            relacionamento. As categorias de dados coletados incluem:</p>
            <ul>
              <li>Nome e endereço de e-mail fornecidos voluntariamente em formulários de newsletter ou
              de contato;</li>
              <li>Dados de navegação anônimos, como páginas visitadas, tempo de permanência e origem
              do acesso, coletados por meio de cookies analíticos;</li>
              <li>Endereço IP e informações sobre o dispositivo e o navegador utilizados, para fins
              de segurança e análise de audiência;</li>
              <li>Preferências de conteúdo inferidas a partir do comportamento de leitura no site.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Como usamos seus dados</h2>
            <p>Utilizamos os dados coletados para as seguintes finalidades:</p>
            <ul>
              <li>Envio da newsletter e materiais informativos sobre o mercado imobiliário de Dubai,
              exclusivamente para usuários que optaram por recebê-los;</li>
              <li>Análise de audiência e melhoria contínua do conteúdo editorial publicado;</li>
              <li>Resposta a mensagens e solicitações enviadas por meio dos canais de contato;</li>
              <li>Prevenção de fraudes e garantia da segurança do portal;</li>
              <li>Cumprimento de obrigações legais e regulatórias aplicáveis.</li>
            </ul>
            <p>
              Não vendemos, alugamos nem compartilhamos seus dados pessoais com terceiros para fins
              comerciais sem seu consentimento expresso.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Base legal para o tratamento</h2>
            <p>
              O tratamento de dados pessoais neste portal é realizado com base nas seguintes hipóteses
              legais previstas na LGPD: consentimento do titular (art. 7º, I), legítimo interesse do
              controlador (art. 7º, IX) e cumprimento de obrigação legal (art. 7º, II). Você pode
              revogar seu consentimento a qualquer momento, sem prejuízo à legalidade do tratamento
              realizado anteriormente.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Seus direitos como titular</h2>
            <p>
              Nos termos da LGPD, você tem direito a: confirmar a existência de tratamento; acessar
              seus dados; corrigir dados incompletos ou desatualizados; solicitar a anonimização,
              bloqueio ou eliminação de dados desnecessários; solicitar a portabilidade dos dados;
              revogar o consentimento; e apresentar reclamação à Autoridade Nacional de Proteção de
              Dados (ANPD). Para exercer qualquer desses direitos, envie uma solicitação ao nosso
              canal de contato informado ao final desta política.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Cookies e tecnologias de rastreamento</h2>
            <p>
              Utilizamos cookies próprios e de terceiros para melhorar a experiência de navegação,
              analisar o tráfego e personalizar o conteúdo exibido. Você pode gerenciar suas
              preferências de cookies a qualquer momento nas configurações do seu navegador. Para
              mais detalhes, consulte nosso <a href="/aviso-de-cookies">Aviso de Cookies</a>.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Retenção de dados</h2>
            <p>
              Os dados pessoais são mantidos pelo período necessário para cumprir as finalidades
              descritas nesta política ou conforme exigido por lei. Dados de newsletter são retidos
              enquanto o usuário permanecer inscrito. Dados de navegação anônimos são retidos por
              até 24 meses. Após o período de retenção, os dados são excluídos ou anonimizados de
              forma irreversível.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Contato</h2>
            <p>
              Para dúvidas, solicitações ou reclamações relacionadas ao tratamento de dados pessoais,
              entre em contato pelo e-mail: <strong>privacidade@dubaimoveis.com</strong>. Nossa equipe
              responderá em até 15 dias úteis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
