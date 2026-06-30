export default function ArticleAuthor() {
  return (
    <div className="article-author">
      <div className="article-author-avatar">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
            fill="var(--gold)"
          />
        </svg>
      </div>
      <div className="article-author-info">
        <p className="article-author-name">Equipe Dubai Imóveis</p>
        <p className="article-author-bio">
          Jornalistas e especialistas em mercado imobiliário internacional dedicados a ajudar brasileiros a investir com segurança nos Emirados Árabes Unidos.
        </p>
      </div>
    </div>
  )
}
