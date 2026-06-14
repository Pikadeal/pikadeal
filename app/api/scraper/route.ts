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
      const annonces = []

      if (carte.vinted) {
        const annoncesVinted = await scraperVinted(carte.nom, carte.prix_max)
        annonces.push(...annoncesVinted.map((a: any) => ({ ...a, plateforme: 'Vinted' })))
      }

      if (carte.ebay) {
        const annoncesEbay = await scraperEbay(carte.nom, carte.prix_max)
        annonces.push(...annoncesEbay.map((a: any) => ({ ...a, plateforme: 'eBay' })))
      }

      for (const annonce of annonces) {
        resultats.push({ carte, annonce })

        const { data: dejaEnvoyee } = await supabase
          .from('alertes_envoyees')
          .select('id')
          .eq('carte_id', carte.id)
          .eq('annonce_url', annonce.url)
          .maybeSingle()

        if (dejaEnvoyee) continue

        try {
          const user = await client.users.getUser(carte.user_id)
          const email = user.emailAddresses[0]?.emailAddress

          if (email) {
            await envoyerAlerte(email, carte, annonce, annonce.plateforme)
            emailsEnvoyes++
            console.log(`Email envoye a ${email} pour ${carte.nom} sur ${annonce.plateforme}`)

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
    const url = `https://vinted-api3.p.rapidapi.com/search?query=${encodeURIComponent(nom + ' carte pokemon')}`

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'vinted-api3.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      }
    })

    const data = await res.json()
    const items = data.items || data.data || data.results || []
    const nomLower = nom.toLowerCase()

    return items
      .filter((item: any) => {
        const prix = item.price?.amount || item.price
        const titre = (item.title || item.name || '').toLowerCase()
        const contientLeNom = titre.includes(nomLower)
        const pasUnAccessoire = !titre.includes('porte') && !titre.includes('peluche') && !titre.includes('figurine') && !titre.includes('keychain') && !titre.includes('plush') && !titre.includes('figure') && !titre.includes('sac') && !titre.includes('vetement') && !titre.includes('t-shirt') && !titre.includes('mug')
        return prix && parseFloat(prix) <= prixMax && contientLeNom && pasUnAccessoire
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

async function scraperEbay(nom: string, prixMax: number) {
  try {
    const query = encodeURIComponent(nom + ' pokemon card')
    const url = `https://www.ebay.fr/sch/i.html?_nkw=${query}&_udhi=${prixMax}&LH_BIN=1&_sop=10&LH_PrefLoc=3`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    })

    if (!res.ok) {
      console.log('eBay status:', res.status)
      return []
    }

    const html = await res.text()
    const annonces = []
    const nomLower = nom.toLowerCase()

    const titreRegex = /class="s-item__title[^"]*">([^<]+)<\/span>/g
    const prixRegex = /class="s-item__price">([^<]+)<\/span>/g
    const urlRegex = /class="s-item__link"[^>]*href="([^"]+)"/g
    const imageRegex = /class="s-item__image-img"[^>]*src="([^"]+)"/g

    const titres = []
    const prix = []
    const urls = []
    const images = []

    let match
    while ((match = titreRegex.exec(html)) !== null) titres.push(match[1].trim())
    while ((match = prixRegex.exec(html)) !== null) prix.push(match[1].trim())
    while ((match = urlRegex.exec(html)) !== null) urls.push(match[1].trim())
    while ((match = imageRegex.exec(html)) !== null) images.push(match[1].trim())

    for (let i = 0; i < Math.min(titres.length, 10); i++) {
      const titre = titres[i] || ''
      const prixStr = prix[i] || ''
      const url = urls[i] || ''
      const image = images[i] || ''

      if (!titre || titre === 'Shop on eBay') continue

      const prixNum = parseFloat(prixStr.replace(/[^0-9,.]/g, '').replace(',', '.'))
      if (isNaN(prixNum) || prixNum > prixMax) continue

      const titreLower = titre.toLowerCase()
      if (!titreLower.includes(nomLower)) continue

      const pasUnAccessoire = !titreLower.includes('plush') && !titreLower.includes('figure') && !titreLower.includes('keychain') && !titreLower.includes('shirt')
      if (!pasUnAccessoire) continue

      annonces.push({ titre, prix: prixNum, url, image })
    }

    console.log(`eBay: ${annonces.length} annonces trouvees pour ${nom}`)
    return annonces.slice(0, 3)

  } catch (e) {
    console.log('Erreur eBay:', e)
    return []
  }
}