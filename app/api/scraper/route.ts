import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { envoyerAlerte } from '@/lib/email'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { data: cartes, error } = await supabase
      .from('cartes')
      .select('*')
      .eq('actif', true)

    if (error) throw error

    const resultats = []
    let emailsEnvoyes = 0
    const client = await clerkClient()

    for (const carte of cartes || []) {
      if (carte.vinted) {
        const annoncesVinted = await scraperVinted(carte.nom, carte.prix_max)

        for (const annonce of annoncesVinted) {
          resultats.push({ carte, annonce, plateforme: 'Vinted' })

          // Vérifier si cette annonce a déjà été envoyée
          const { data: dejaEnvoyee } = await supabase
            .from('alertes_envoyees')
            .select('id')
            .eq('carte_id', carte.id)
            .eq('annonce_url', annonce.url)
            .maybeSingle()

          if (dejaEnvoyee) {
            continue
          }

          // Récupérer l'email de l'utilisateur
          try {
            const user = await client.users.getUser(carte.user_id)
            const email = user.emailAddresses[0]?.emailAddress

            if (email) {
              await envoyerAlerte(email, carte, annonce, 'Vinted')
              emailsEnvoyes++
              console.log(`Email envoyé à ${email} pour ${carte.nom}`)

              // Enregistrer comme envoyée
              await supabase.from('alertes_envoyees').insert({
                carte_id: carte.id,
                annonce_url: annonce.url,
              })
            }
          } catch (e) {
            console.log('Erreur envoi email:', e)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      cartes_surveillees: cartes?.length || 0,
      annonces_trouvees: resultats.length,
      emails_envoyes: emailsEnvoyes,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function scraperVinted(nom: string, prixMax: number) {
  try {
    const url = `https://vinted-api3.p.rapidapi.com/search?query=${encodeURIComponent(nom)}`

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'vinted-api3.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      }
    })

    const data = await res.json()
    const items = data.items || data.data || data.results || []

    return items
      .filter((item: any) => {
        const prix = item.price?.amount || item.price
        return prix && parseFloat(prix) <= prixMax
      })
      .slice(0, 3)
      .map((item: any) => ({
        titre: item.title || item.name,
        prix: item.price?.amount || item.price,
        url: item.url || `https://www.vinted.fr/items/${item.id}`,
        image: item.photos?.[0]?.url || item.photo?.url || item.image,
      }))
  } catch (e) {
    console.log('Erreur Vinted:', e)
    return []
  }
}