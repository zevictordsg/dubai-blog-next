import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso de Cookies — Dubai Imóveis',
  description: 'Entenda como o Dubai Imóveis utiliza cookies e como você pode gerenciar suas preferências.',
}

export default function AvisoDeCookies() {
  return (
    <div className="legal-page">
      <div className="container">
        <header className="legal-header">
          <h1 className="legal-title">Aviso de Cookies</h1>
          <p className="legal-updated">Atualizado em: 1 de janeiro de 2025</p>
        </header>
        <div className="legal-body">
          <div className="legal-section">
            <h2>1. O que são cookies</h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você
              visita um site. Eles permitem que o site reconheça seu dispositivo em visitas
              posteriores, lembre suas preferências e melhore sua experiência de navegação.
              Os cookies não contêm informações pessoais diretamente identificáveis e não podem
              executar programas nem transmitir vírus.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Tipos de cookies que utilizamos</h2>
            <p>O portal Dubai Imóveis utiliza as seguintes categorias de cookies:</p>
            <ul>
              <li>
                <strong>Cookies estritamente necessários:</strong> essenciais para o funcionamento
                do site, como segurança de sessão e preferências de idioma. Não podem ser
                desativados.
              </li>
              <li>
                <strong>Cookies de desempenho e análise:</strong> coletam informações anônimas
                sobre como os visitantes utilizam o site (páginas visitadas, tempo de permanência,
                erros encontrados). Usamos ferramentas como Google Analytics para esta finalidade.
              </li>
              <li>
                <strong>Cookies de funcionalidade:</strong> lembram suas preferências de navegação,
                como o formato de leitura preferido e artigos marcados para leitura posterior.
              </li>
              <li>
                <strong>Cookies de marketing (terceiros):</strong> utilizados por parceiros para
                exibir anúncios relevantes ao seu perfil de interesse. Esses cookies rastreiam seu
                comportamento entre diferentes sites.
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Cookies de terceiros</h2>
            <p>
              Nosso portal pode incluir conteúdo ou ferramentas de terceiros que também utilizam
              cookies, como vídeos incorporados, widgets de redes sociais e ferramentas de análise.
              Não temos controle sobre os cookies definidos por esses terceiros. Recomendamos que
              você consulte as políticas de privacidade dos respectivos fornecedores para entender
              como utilizam seus dados.
            </p>
            <p>Os principais terceiros que podem definir cookies no nosso portal incluem:</p>
            <ul>
              <li>Google Analytics (análise de audiência)</li>
              <li>Meta Pixel / Facebook (publicidade e conversão)</li>
              <li>YouTube (vídeos incorporados)</li>
              <li>Hotjar (análise de comportamento de usuários)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Como gerenciar seus cookies</h2>
            <p>
              Você pode gerenciar ou desativar cookies diretamente nas configurações do seu
              navegador. Observe que desativar determinados cookies pode afetar a funcionalidade
              e a experiência de uso do portal. Consulte a documentação do seu navegador para
              instruções específicas:
            </p>
            <ul>
              <li>Google Chrome: Configurações → Privacidade e segurança → Cookies e outros dados do site</li>
              <li>Mozilla Firefox: Opções → Privacidade e segurança → Cookies e dados do site</li>
              <li>Apple Safari: Preferências → Privacidade → Gerenciar dados do site</li>
              <li>Microsoft Edge: Configurações → Cookies e permissões do site</li>
            </ul>
            <p>
              Para optar pela exclusão de cookies de análise do Google Analytics em todos os sites,
              você pode instalar o Add-on de desativação do Google Analytics disponível em
              tools.google.com/dlpage/gaoptout.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Consentimento e atualização das preferências</h2>
            <p>
              Na sua primeira visita ao portal, exibimos um aviso de cookies solicitando seu
              consentimento para o uso de cookies não essenciais. Você pode alterar suas
              preferências a qualquer momento clicando no link "Gerenciar cookies" disponível
              no rodapé do site. Seu consentimento é registrado e associado ao seu dispositivo por
              um período de 12 meses, após o qual solicitaremos sua confirmação novamente.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Alterações neste aviso</h2>
            <p>
              Podemos atualizar este Aviso de Cookies periodicamente para refletir mudanças nas
              tecnologias que utilizamos ou em requisitos legais. A data da última atualização
              está indicada no início deste documento. Recomendamos que você revise este aviso
              regularmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
