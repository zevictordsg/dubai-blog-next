/**
 * Webhook de revalidação — chamado pelo WordPress quando um post é publicado.
 *
 * Configuração no WordPress:
 *  1. Instale o plugin "WP Webhooks" (gratuito)
 *  2. Crie uma ação em: WP Webhooks → Send Data → Post published
 *  3. URL: https://seu-site.vercel.app/api/revalidate?secret=SEU_TOKEN
 *
 * Ou adicione no seu functions.php:
 *   add_action('save_post', function($id) {
 *     if (wp_is_post_revision($id)) return;
 *     $token = 'SEU_TOKEN';
 *     wp_remote_post("https://seu-site.vercel.app/api/revalidate?secret={$token}");
 *   });
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath }            from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Token inválido.' }, { status: 401 })
  }

  try {
    // Revalida homepage, todas as categorias e o cache geral
    revalidatePath('/')
    revalidatePath('/categoria/[slug]', 'page')
    revalidatePath('/[slug]', 'page')

    return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 })
  }
}

// Também aceita GET (para testar no browser)
export async function GET(req: NextRequest) {
  return POST(req)
}
