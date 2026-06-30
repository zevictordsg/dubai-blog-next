'use client'

import { useEffect } from 'react'

/**
 * Adiciona `is-visible` a elementos [data-animate] conforme entram no viewport
 * durante o scroll. Sem fallback de tempo — a animação só ocorre quando o
 * elemento for realmente visualizado pelo usuário.
 */
export default function AnimationObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-animate]'))
    if (!els.length) return

    const show = (el: Element) => el.classList.add('is-visible')

    // Fallback para browsers sem suporte: mostra tudo imediatamente
    if (!('IntersectionObserver' in window)) {
      els.forEach(show)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target)
            observer.unobserve(entry.target) // anima uma vez só, sem reverter
          }
        })
      },
      {
        threshold:  0.07,
        rootMargin: '0px 0px -32px 0px', // dispara um pouco antes do elemento chegar à borda inferior
      }
    )

    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}
