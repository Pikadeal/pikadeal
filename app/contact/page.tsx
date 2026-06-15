'use client'

import { useState } from 'react'

export default function Contact() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sujet, setSujet] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [loading, setLoading] = useState(false)

  async function envoyerMessage() {
    if (!nom || !email || !message) return
    setLoading(true)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, email, sujet, message }),
    })

    if (res.ok) setEnvoye(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 font-bold text-sm">P</div>
          <span className="font-semibold text-gray-900 text-lg">PikaDeal</span>
        </a>
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600">← Retour</a>
      </nav>

      {/* HERO */}
      <div className="bg-amber-50 px-8 py-12 text-center">
        <p className="text-4xl mb-4">💬</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Nous contacter</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Une question, un bug, une suggestion ? On est la pour toi. PikaDeal est en beta et tes retours nous aident a ameliorer le service !
        </p>
      </div>

      {/* CARDS RAISONS */}
      <div className="px-8 py-10 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 text-center shadow-sm">
          <p className="text-2xl mb-2">🐛</p>
          <p className="font-semibold text-gray-900 text-sm mb-1">Signaler un bug</p>
          <p className="text-xs text-gray-400">Une fonctionnalite ne marche pas comme prevu ?</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 text-center shadow-sm">
          <p className="text-2xl mb-2">💡</p>
          <p className="font-semibold text-gray-900 text-sm mb-1">Suggerer une idee</p>
          <p className="text-xs text-gray-400">Tu as une idee pour ameliorer PikaDeal ?</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 text-center shadow-sm">
          <p className="text-2xl mb-2">❓</p>
          <p className="font-semibold text-gray-900 text-sm mb-1">Poser une question</p>
          <p className="text-xs text-gray-400">Tu ne comprends pas comment ca marche ?</p>
        </div>
      </div>

      {/* FORMULAIRE */}
      <div className="px-8 pb-16 max-w-lg mx-auto">

        {envoye ? (
          <div className="text-center py-12 bg-green-50 rounded-2xl">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-xl font-bold text-gray-900 mb-2">Message envoye !</p>
            <p className="text-gray-500 mb-6">On te repondra dans les plus brefs delais.</p>
            <a href="/" className="px-6 py-3 bg-amber-400 text-amber-900 font-medium rounded-lg hover:bg-amber-500">
              Retour a l'accueil
            </a>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ton prenom</label>
              <input
                type="text"
                placeholder="Ex : Marie"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ton email</label>
              <input
                type="email"
                placeholder="Ex : marie@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
              <select
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400"
              >
                <option value="">Choisir un sujet...</option>
                <option value="bug">Signaler un bug</option>
                <option value="suggestion">Suggerer une idee</option>
                <option value="question">Poser une question</option>
                <option value="abonnement">Probleme d'abonnement</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ton message</label>
              <textarea
                placeholder="Decris ton probleme, ta suggestion ou ta question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              onClick={envoyerMessage}
              disabled={loading || !nom || !email || !message}
              className="w-full py-3 bg-amber-400 text-amber-900 font-semibold rounded-xl hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              On repond generalement sous 24h
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="text-center py-6 border-t border-gray-100 text-gray-400 text-sm">
        2025 PikaDeal — Fait avec amour pour les dresseurs
      </footer>

    </main>
  )
}