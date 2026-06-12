import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function envoyerAlerte(
  email: string,
  carte: any,
  annonce: any,
  plateforme: string
) {
  const economie = carte.image_url ? '' : ''

  await resend.emails.send({
    from: 'PikaDeal <onboarding@resend.dev>',
    to: email,
    subject: `⚡ ${carte.nom} trouvé sur ${plateforme} - ${annonce.prix}€`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
          <div style="width: 36px; height: 36px; background: #fbbf24; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">⚡</div>
          <span style="font-size: 18px; font-weight: 600; color: #111;">PikaDeal — Alerte trouvée</span>
        </div>

        <p style="font-size: 16px; font-weight: 600; color: #111; margin-bottom: 16px;">
          ${carte.nom}
        </p>

        ${annonce.image ? `<img src="${annonce.image}" alt="${carte.nom}" style="width: 100%; max-width: 200px; border-radius: 8px; margin-bottom: 16px;" />` : ''}

        <p style="font-size: 14px; color: #555; margin-bottom: 16px;">
          ${annonce.titre}
        </p>

        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
          <div style="background: #f9fafb; border-radius: 8px; padding: 12px; text-align: center; flex: 1;">
            <p style="font-size: 11px; color: #999; margin: 0;">Prix annonce</p>
            <p style="font-size: 18px; font-weight: 600; color: #111; margin: 4px 0 0;">${annonce.prix}€</p>
          </div>
          <div style="background: #f9fafb; border-radius: 8px; padding: 12px; text-align: center; flex: 1;">
            <p style="font-size: 11px; color: #999; margin: 0;">Ton prix max</p>
            <p style="font-size: 18px; font-weight: 600; color: #111; margin: 4px 0 0;">${carte.prix_max}€</p>
          </div>
        </div>

        <a href="${annonce.url}" style="display: block; text-align: center; background: #fbbf24; color: #422006; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Voir l'annonce sur ${plateforme}
        </a>

        <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
          PikaDeal — Ne rate plus jamais une bonne affaire Pokémon
        </p>
      </div>
    `,
  })
}