'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { traduire, traduireSet } from '@/lib/traductions'

export default function AjouterCarte() {
  const { user } = useUser()
  const router = useRouter()
  const [nom, setNom] = useState('')
  const [prixMax, setPrixMax] = useState('')
  const [etat, setEtat] = useState('Near Mint')
  const [vinted, setVinted] = useState(true)
  const [ebay, setEbay] = useState(true)
  const [langue, setLangue] = useState('FR')
  const [loading, setLoading] = useState(false)
  const [recherche, setRecherche] = useState<any[]>([])
  const [carteSelectionnee, setCarteSelectionnee] = useState<any>(null)
  const [recherching, setRecherching] = useState(false)
  const [erreur, setErreur] = useState('')

  async function rechercherCarte(query: string) {
    setNom(query)
    setCarteSelectionnee(null)
    if (query.length < 2) {
      setRecherche([])
      return
    }
    setRecherching(true)
    try {
      const mots = query.trim().split(' ')
      const premierMot = traduire(mots[0])
      const reste = mots.slice(1).join(' ')
      const setTraduit = reste ? traduireSet(reste) : ''
      const queryAPI = setTraduit
        ? `name:${premierMot}* set.name:"${setTraduit}"`
        : `name:${premierMot}*`
      const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(queryAPI)}&pageSize=20`)
      const data = await res.json()
      setRecherche(data.data || [])
    } catch (e) {
      console.log('Erreur recherche:', e)
    }
    setRecherching(false)
  }

  function selectionnerCarte(carte: any) {
    setCarteSelectionnee(carte)
    setRecherche([])
  }

  async function ajouterCarte() {
    if (!nom || !prixMax) return
    setLoading(true)
    setErreur('')

    const { data: userData } = await supabase
      .from('users')
      .select('premium')
      .eq('id', user?.id)
      .maybeSingle()

    const isPremium = userData?.premium || false

    if (!isPremium) {
      const { count } = await supabase
        .from('cartes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      if (count !== null && count >= 5) {
        setErreur('limite')
        setLoading(false)
        return
      }
    }

    const { error } = await supabase.from('cartes').insert({
      user_id: user?.id,
      nom,
      prix_max: parseInt(prixMax),
      etat,
      vinted,
      ebay,
      langue,
      actif: true,
      image_url: carteSelectionnee?.images?.small || null,
      set_name: carteSelectionnee?.set?.name || null,
    })

    if (error) {
      console.log('Erreur:', error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-white">

      <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-4">
        <a href="/dashboard" className="text-gray-400 hover:text-gray-600">Retour</a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ajouter une carte</h1>
          <p className="text-gray-400 text-sm mt-1">Configure ton alerte en quelques secondes</p>
        </div>
      </div>

      <div className="px-8 py-8 max-w-lg">

        {erreur === 'limite' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="font-semibold text-amber-900 mb-1">Limite de 5 cartes atteinte</p>
            <p className="text-sm text-amber-700 mb-3">Passe Premium pour surveiller des cartes illimitees sur Vinted et eBay !</p>
            <button
              onClick={async () => {
                const res = await fetch('/api/checkout', { method: 'POST' })
                const data = await res.json()
                if (data.url) window.location.href = data.url
              }}
              className="px-4 py-2 bg-amber-400 text-amber-900 text-sm font-medium rounded-lg hover:bg-amber-500"
            >
              Passer Premium — 9 EUR/mois
            </button>
          </div>
        )}

        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Recherche une carte</label>
          <input
            type="text"
            placeholder="Ex : Dracaufeu Base Set, Charizard Jungle, Pikachu..."
            value={nom}
            onChange={(e) => rechercherCarte(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400"
          />
          {recherching && <p className="text-xs text-amber-500 mt-2">Recherche en cours...</p>}
          {recherche.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 overflow-hidden max-h-80 overflow-y-auto">
              {recherche.map((carte: any) => (
                <div
                  key={carte.id}
                  onClick={() => selectionnerCarte(carte)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <img src={carte.images.small} alt={carte.name} className="w-10 h-14 object-contain rounded flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{nom}</p>
                    <p className="text-xs text-amber-700 font-medium">{carte.set.name}</p>
                    <p className="text-xs text-gray-400">{carte.name} — {carte.rarity || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!recherching && nom.length >= 2 && recherche.length === 0 && !carteSelectionnee && (
            <p className="text-xs text-gray-400 mt-2">Aucune carte trouvee — essaie un autre nom</p>
          )}
        </div>

        {carteSelectionnee && (
          <div className="mb-6 flex items-center gap-4 p-4 bg-amber-50 rounded-xl border-2 border-amber-400">
            <img src={carteSelectionnee.images.small} alt={carteSelectionnee.name} className="w-16 object-contain rounded-lg flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">{nom}</p>
              <p className="text-sm text-amber-700">{carteSelectionnee.set.name}</p>
              <p className="text-xs text-amber-600">{carteSelectionnee.name} — {carteSelectionnee.rarity || ''}</p>
              <p className="text-xs text-green-600 mt-1">Carte selectionnee</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Prix maximum accepte</label>
          <div className="relative">
            <input
              type="number"
              placeholder="Ex : 80"
              value={prixMax}
              onChange={(e) => setPrixMax(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400"
            />
            <span className="absolute right-4 top-3.5 text-gray-400">EUR</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Etat minimum</label>
          <select
            value={etat}
            onChange={(e) => setEtat(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400"
          >
            <option>Mint</option>
            <option>Near Mint</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Peu importe</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Version de la carte</label>
          <div className="flex gap-3">
            {['FR', 'EN', 'JP'].map((l) => (
              <button
                key={l}
                onClick={() => setLangue(l)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${langue === l ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-gray-200 text-gray-400'}`}
              >
                {l === 'FR' ? 'Francais' : l === 'EN' ? 'Anglais' : 'Japonais'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Plateformes a surveiller</label>
          <div className="flex gap-3">
            <button
              onClick={() => setVinted(!vinted)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${vinted ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-gray-200 text-gray-400'}`}
            >
              Vinted
            </button>
            <button
              onClick={() => setEbay(!ebay)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${ebay ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-gray-200 text-gray-400'}`}
            >
              eBay
            </button>
          </div>
        </div>

        <button
          onClick={ajouterCarte}
          disabled={loading || !nom || !prixMax}
          className="w-full py-3 bg-amber-400 text-amber-900 font-semibold rounded-xl hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Ajout en cours...' : 'Creer lalerte'}
        </button>

      </div>
    </main>
  )
}