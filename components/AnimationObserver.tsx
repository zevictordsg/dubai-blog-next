'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Adiciona `is-visible` a elementos [data-animate] conforme entram no viewport.
 *
 * Usa `pathname` como dependência para re-observar após cada navegação
 * client-side (Next.js App Router): quando o usuário vai a uma página e volta,
 * os elementos [data-animate] são novos nós no DOM — sem essa dependência,
 * o observer nunca os encontraria e eles ficariam em opacity:0.
 */
export default function AnimationObserver() {
  const pathname = usePathname()

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let fallback: ReturnType<typeof setTimeout> | null = null

    const show = (el: Element) => el.classList.add('is-visible')

    // requestAnimationFrame garante que o novo DOM foi pintado antes do querySelectorAll
    const raf = requestAnimationFrame(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-animate]'))
      if (!els.length) return

      // Fallback para browsers sem suporte a IntersectionObserver
      if (!('IntersectionObserver' in window)) {
        els.forEach(show)
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              show(entry.target)
              observer!.unobserve(entry.target) // anima uma vez só
            }
          })
        },
        {
          threshold:  0.07,
          rootMargin: '0px 0px -32px 0px',
        }
      )

      els.forEach((el) => observer!.observe(el))

      // Segurança: após 3.5s, elementos ainda invisíveis são forçados a aparecer
      fallback = setTimeout(() => els.forEach(show), 3500)
    })

    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
      if (fallback !== null) clearTimeout(fallback)
    }
  }, [pathname]) // re-executa em cada navegação

  return null
}
