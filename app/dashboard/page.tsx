'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'

function DashboardContent() {
  const { user, isLoaded } = useUser()
  const [cartes, setCartes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      fetchCartes()
      fetchPremium()
    } else if (isLoaded && !user) {
      setLoading(false)
    }
  }, [isLoaded, user])

  async function fetchCartes() {
    const { data } = await supabase
      .from('cartes')
      .select('*')
      .eq('user_id', user?.id)
    setCartes(data || [])
    setLoading(false)
  }

  async function fetchPremium() {
    const res = await fetch('/api/premium')
    const data = await res.json()
    setIsPremium(data?.premium || false)
  }

  async function toggleActif(id: string, actif: boolean) {
    await supabase.from('cartes').update({ actif: !actif }).eq('id', id)
    fetchCartes()
  }

  async function supprimerCarte(id: string) {
    await supabase.from('cartes').delete().eq('id', id)
    fetchCartes()
  }

  async function passerPremium() {
    const res = await fetch('/api/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Tu dois etre connecte pour acceder au dashboard</p>
          <a href="/" className="px-4 py-2 bg-amber-400 text-amber-900 rounded-lg">Retour a l'accueil</a>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">

      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour {user?.firstName}
            </h1>
            {isPremium && (
              <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                PREMIUM
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1">Voici tes cartes surveillees</p>
        </div>
        <div className="flex gap-2">
          {!isPremium && (
            <button
              onClick={passerPremium}
              className="px-4 py-2 border border-amber-400 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50"
            >
              Passer Premium
            </button>
          )}
          <a href="/dashboard/ajouter" className="px-4 py-2 bg-amber-400 text-amber-900 text-sm font-medium rounded-lg hover:bg-amber-500">
            + Ajouter une carte
          </a>
        </div>
      </div>

      <div className="px-8 py-6 grid grid-cols-3 gap-4 max-w-2xl">
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-xs text-amber-700 mb-1">Cartes surveillees</p>
          <p className="text-2xl font-bold text-amber-900">{cartes.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs text-green-700 mb-1">Alertes ce mois</p>
          <p className="text-2xl font-bold text-green-900">0</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs text-blue-700 mb-1">Economies detectees</p>
          <p className="text-2xl font-bold text-blue-900">0 EUR</p>
        </div>
      </div>

      <div className="px-8 py-4">

        {loading && <p className="text-gray-400 text-sm">Chargement...</p>}

        {!loading && cartes.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 font-medium mb-1">Aucune carte surveillee</p>
            <p className="text-gray-400 text-sm mb-4">Ajoute ta premiere carte pour commencer</p>
            <a href="/dashboard/ajouter" className="px-4 py-2 bg-amber-400 text-amber-900 text-sm font-medium rounded-lg hover:bg-amber-500">
              Ajouter une carte
            </a>
          </div>
        )}

        {!loading && cartes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cartes.map((carte: any) => (
              <div key={carte.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl">
                {carte.image_url ? (
                  <img src={carte.image_url} alt={carte.nom} className="w-16 object-contain rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-16 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl p-4">
                    ?
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-900 truncate">{carte.nom}</p>
                    <span className="text-xs ml-2 flex-shrink-0">{carte.langue}</span>
                  </div>
                  {carte.set_name && <p className="text-xs text-gray-400 mb-2">{carte.set_name}</p>}
                  <p className="text-sm text-gray-500 mb-3">Prix max : <span className="font-medium text-gray-900">{carte.prix_max} EUR</span></p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {carte.vinted && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Vinted</span>}
                    {carte.ebay && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">eBay</span>}
                    <span className={`text-xs px-2 py-1 rounded-full ${carte.actif ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                      {carte.actif ? 'Actif' : 'Pause'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActif(carte.id, carte.actif)}
                      className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                    >
                      {carte.actif ? 'Mettre en pause' : 'Reactiver'}
                    </button>
                    <button
                      onClick={() => supprimerCarte(carte.id)}
                      className="text-xs px-3 py-1.5 border border-red-100 rounded-lg text-red-400 hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-400">Chargement...</p></div>}>
      <DashboardContent />
    </Suspense>
  )
}