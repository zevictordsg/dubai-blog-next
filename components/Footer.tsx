import Link from 'next/link'

const WA_NUMBER = '5511999999999'
const WA_MSG    = encodeURIComponent('Olá! Encontrei o site da GAP Capital Real Estate e gostaria de saber mais sobre investimentos em Dubai.')
const WA_HREF   = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`

const BoltGold = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 2L4 13.5H11L10.5 22L21 10.5H14L13 2Z" fill="var(--gold)" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.55 4.103 1.514 5.83L.057 23.214a.5.5 0 0 0 .62.62l5.463-1.426A11.935 11.935 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-inner">

        {/* ── 4 colunas de links ──────────────────────────────────────────── */}
        <div className="footer-cols">

          <div>
            <p className="footer-col-title">A Empresa</p>
            <div className="footer-col-links">
              <a href="/sobre">Quem somos</a>
              <a href="/sobre#equipe">Nossa equipe</a>
              <a href="/contato">Trabalhe conosco</a>
              <a href="/contato">Portal para Parceiros</a>
              <a href="/contato">Sala de Imprensa</a>
              <a href="/sobre#valores">Valores editoriais</a>
            </div>
          </div>

          <div>
            <p className="footer-col-title">Sobre o blog</p>
            <div className="footer-col-links">
              <a href="/sobre">Sobre o blog</a>
              <a href="/contato">Contato</a>
              <a href="/categoria/investimento">Como investir em Dubai</a>
            </div>
          </div>

          <div>
            <p className="footer-col-title">Política de privacidade</p>
            <div className="footer-col-links">
              <Link href="/politica-de-privacidade">Política de privacidade</Link>
              <Link href="/termos-de-uso">Termos de uso</Link>
              <Link href="/aviso-de-cookies">Aviso de cookies</Link>
              <Link href="/isencao-de-responsabilidade">Isenção de responsabilidade</Link>
            </div>
          </div>

          <div>
            <p className="footer-col-title">Contato</p>
            <div className="footer-col-links">
              <a href={WA_HREF} target="_blank" rel="noopener noreferrer">Fale com especialista</a>
              <a href={WA_HREF} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href="mailto:contato@gapcapitalrealestate.com.br">E-mail de contato</a>
            </div>
          </div>

        </div>

        {/* ── Rodapé inferior: logo-mark + CTA ───────────────────────────── */}
        <div className="footer-bottom">
          <div className="footer-logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/imagens/logocerta.svg"
              alt="GAP Capital Real Estate"
              style={{ height: 40, width: 'auto', display: 'block', marginBottom: 8 }}
            />
            <p className="footer-copy">© {year} GAP Capital Real Estate. O capital que transcende.</p>
          </div>

          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-green"
            style={{ fontSize: 14, padding: '12px 24px', gap: 10 }}
          >
            <WhatsAppIcon />
            Falar com Especialista
          </a>
        </div>

      </div>
    </footer>
  )
}
