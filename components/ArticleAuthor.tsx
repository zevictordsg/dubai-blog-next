export default function ArticleAuthor() {
  return (
    <div className="article-author">
      <div className="article-author-avatar" aria-hidden="true"
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--dark)', color: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 600, letterSpacing: '.03em', flexShrink: 0,
        }}>
        GL
      </div>
      <div className="article-author-info">
        <p className="article-author-name">Guilherme Lemos</p>
        <p className="article-author-bio">
          Por Guilherme Lemos, especialista em dolarização de patrimônio por meio de imóveis, com mais de 15 anos ajudando investidores brasileiros a construir renda e patrimônio em moeda forte.
        </p>
      </div>
    </div>
  )
}
