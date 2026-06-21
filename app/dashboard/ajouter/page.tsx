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
  const [etape, setEtape] = useState(1)
  const [filtreSet, setFiltreSet] = useState('')

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
      const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(queryAPI)}&pageSize=24`)
      const data = await res.json()
      setRecherche(data.data || [])
    } catch (e) {
      console.log('Erreur recherche:', e)
    }
    setRecherching(false)
  }

  function selectionnerCarte(carte: any) {
    setCarteSelectionnee(carte)
    setEtape(2)
    window.scrollTo(0, 0)
  }

  const sets = [...new Set(recherche.map((c: any) => c.set.name))].sort()
  const cartesFiltrees = filtreSet
    ? recherche.filter((c: any) => c.set.name === filtreSet)
    : recherche

  async function ajouterCarte() {
    if (!nom || !prixMax) return
    setLoading(true)
    setErreur('')

    const premiumRes = await fetch('/api/premium')
    const premiumData = await premiumRes.json()
    const isPremium = premiumData?.premium || false

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
        {etape === 2 ? (
          <button onClick={() => setEtape(1)} className="text-gray-400 hover:text-gray-600">Retour</button>
        ) : (
          <a href="/dashboard" className="text-gray-400 hover:text-gray-600">Retour</a>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ajouter une carte</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${etape === 1 ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-400'}`}>1. Choisir la carte</span>
            <span className="text-gray-300 text-xs">→</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${etape === 2 ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-400'}`}>2. Configurer l'alerte</span>
          </div>
        </div>
      </div>

      {/* ETAPE 1 — RECHERCHE */}
      {etape === 1 && (
        <div className="px-8 py-8">

          <div className="max-w-2xl mx-auto mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Recherche une carte Pokemon</label>
            <input
              type="text"
              placeholder="Ex : Dracaufeu, Charizard, Mewtwo, Pikachu..."
              value={nom}
              onChange={(e) => rechercherCarte(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 text-lg"
              autoFocus
            />
            {recherching && <p className="text-xs text-amber-500 mt-2">Recherche en cours...</p>}
          </div>

          {recherche.length > 0 && (
            <div className="max-w-4xl mx-auto">

              {sets.length > 1 && (
                <div className="mb-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFiltreSet('')}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filtreSet === '' ? 'bg-amber-400 text-amber-900 border-amber-400' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    Tous les sets ({recherche.length})
                  </button>
                  {sets.map((set: string) => (
                    <button
                      key={set}
                      onClick={() => setFiltreSet(set)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filtreSet === set ? 'bg-amber-400 text-amber-900 border-amber-400' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {set} ({recherche.filter((c: any) => c.set.name === set).length})
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {cartesFiltrees.map((carte: any) => (
                  <div
                    key={carte.id}
                    onClick={() => selectionnerCarte(carte)}
                    className="cursor-pointer group"
                  >
                    <div className="relative rounded-xl overflow-hidden border-2 border-transparent group-hover:border-amber-400 transition-all">
                      <img
                        src={carte.images.small}
                        alt={carte.name}
                        className="w-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{carte.set.name}</p>
                    <p className="text-xs text-gray-300">{carte.number}/{carte.set.total}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {!recherching && nom.length >= 2 && recherche.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p>Aucune carte trouvee pour "{nom}"</p>
              <p className="text-sm mt-1">Essaie en anglais ou verifie l'orthographe</p>
            </div>
          )}

          {nom.length === 0 && (
            <div className="text-center py-12 text-gray-400 max-w-md mx-auto">
              <p className="text-4xl mb-3">🎴</p>
              <p className="font-medium text-gray-500 mb-2">Cherche la carte que tu veux surveiller</p>
              <p className="text-sm">Tu peux taper le nom en francais ou en anglais</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['Dracaufeu', 'Pikachu', 'Mewtwo', 'Ronflex', 'Lokhlass', 'Minidraco'].map(s => (
                  <button
                    key={s}
                    onClick={() => rechercherCarte(s)}
                    className="text-xs px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full hover:bg-amber-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ETAPE 2 — CONFIGURATION */}
      {etape === 2 && carteSelectionnee && (
        <div className="px-8 py-8 max-w-lg mx-auto">

          {erreur === 'limite' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="font-semibold text-amber-900 mb-1">Limite de 5 cartes atteinte</p>
              <p className="text-sm text-amber-700 mb-3">Passe Premium pour surveiller des cartes illimitees !</p>
              <button
                onClick={async () => {
                  const res = await fetch('/api/checkout', { method: 'POST' })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                }}
                className="px-4 py-2 bg-amber-400 text-amber-900 text-sm font-medium rounded-lg hover:bg-amber-500"
              >
                Passer Premium — 4.99 EUR/mois
              </button>
            </div>
          )}

          <div className="mb-8 flex items-center gap-4 p-4 bg-amber-50 rounded-xl border-2 border-amber-400">
            <img src={carteSelectionnee.images.small} alt={carteSelectionnee.name} className="w-20 object-contain rounded-lg flex-shrink-0" />
            <div>
              <p className="font-bold text-amber-900 text-lg">{nom}</p>
              <p className="text-sm text-amber-700">{carteSelectionnee.set.name}</p>
              <p className="text-xs text-amber-600">{carteSelectionnee.name} — {carteSelectionnee.rarity || ''}</p>
              <p className="text-xs text-amber-500">Carte {carteSelectionnee.number}/{carteSelectionnee.set.total}</p>
            </div>
          </div>

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
            <p className="text-xs text-gray-400 mt-2">
              Les illustrations sont identiques entre les versions. La langue determine dans quelle langue on cherche sur Vinted et eBay.
            </p>
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
            disabled={loading || !prixMax}
            className="w-full py-3 bg-amber-400 text-amber-900 font-semibold rounded-xl hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ajout en cours...' : 'Creer l\'alerte'}
          </button>

        </div>
      )}

    </main>
  )
}