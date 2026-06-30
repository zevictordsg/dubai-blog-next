'use client'

import { useState } from 'react'

const ITEMS = [
  {
    q: 'Brasileiros podem comprar imóvel em Dubai?',
    a: 'Sim. Dubai permite que qualquer estrangeiro compre imóveis em áreas "freehold" sem restrições de nacionalidade. O processo é 100% legal e regulado pelo RERA (Real Estate Regulatory Agency), órgão governamental que protege compradores internacionais.',
  },
  {
    q: 'Qual é o ROI médio dos imóveis em Dubai?',
    a: 'O retorno médio com aluguel varia entre 6% e 12% ao ano dependendo da região e tipo do imóvel — bem acima dos 4–5% típicos em mercados europeus. Regiões como Dubai Marina e Jumeirah Village Circle costumam entregar entre 7–9% de yield.',
  },
  {
    q: 'Preciso pagar imposto de renda sobre os ganhos?',
    a: 'Não em Dubai. Os Emirados Árabes não cobram Imposto de Renda Pessoal, portanto renda de aluguel e ganhos de capital são isentos localmente. No Brasil, você precisa declarar o imóvel no IRPF (Bens e Direitos) e informar a renda no exterior.',
  },
  {
    q: 'Quanto preciso ter para começar a investir?',
    a: 'É possível encontrar imóveis a partir de US$ 150.000 em regiões emergentes como JVC ou Sports City. Para áreas prime (Marina, Downtown), o ticket médio começa em US$ 400.000. Há também opções de parcelamento direto com construtoras, sem exigência de financiamento bancário.',
  },
  {
    q: 'Como faço para enviar dinheiro do Brasil para Dubai?',
    a: 'A remessa internacional é feita via câmbio autorizado pelo Banco Central do Brasil. Valores acima de US$ 1 milhão devem ser declarados no CBE (Capitais Brasileiros no Exterior). Recomendamos trabalhar com um assessor de câmbio especializado em operações internacionais.',
  },
  {
    q: 'É seguro comprar imóvel na planta em Dubai?',
    a: 'Sim, desde que a construtora seja registrada no RERA e os pagamentos depositados em conta escrow regulamentada pelo governo. Dubai criou esse sistema exatamente para proteger compradores internacionais — os fundos só são liberados à construtora conforme a obra avança.',
  },
]

export default function HomeFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="faq-list">
      {ITEMS.map((item, i) => (
        <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`}>
          <button
            className="faq-question"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            aria-expanded={openIdx === i}
          >
            <span>{item.q}</span>
            <svg
              className="faq-icon"
              width="20" height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="faq-answer">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
