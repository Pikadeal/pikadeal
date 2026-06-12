export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">

      {/* NAV */}
      <nav className="flex items-center px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 font-bold text-sm">⚡</div>
          <span className="font-semibold text-gray-900 text-lg">PikaDeal</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-8 bg-amber-50">
        <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full mb-6">Vinted · eBay · Cardmarket</span>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Ne rate plus jamais<br />une bonne affaire Pokémon
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
          PikaDeal surveille Vinted et eBay 24h/24 et t'envoie un email quand une carte de ta liste apparait sous le prix Cardmarket.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="px-6 py-3 bg-amber-400 text-amber-900 font-medium rounded-lg hover:bg-amber-500">Commencer gratuitement</button>
          <button className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">Voir une demo</button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Tout ce que fait PikaDeal</h2>
        <p className="text-center text-gray-500 mb-10">Une fois ta liste configuree, tu n'as plus rien a faire.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🔔", title: "Alertes instantanees", desc: "Email des qu'une carte apparait" },
            { icon: "📊", title: "Score de deal", desc: "Comparaison auto avec Cardmarket" },
            { icon: "🌍", title: "Multi-plateformes", desc: "Vinted + eBay en meme temps" },
            { icon: "🎯", title: "Filtres precis", desc: "Etat, pays vendeur, prix max" },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-3">{f.icon}</div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{f.title}</p>
              <p className="text-gray-400 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALERTE EMAIL */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">A quoi ressemble l'alerte</h2>
          <p className="text-center text-gray-500 mb-8">Un email clair, direct, avec tout ce qu'il faut pour decider vite.</p>
          <div className="bg-white rounded-xl border-l-4 border-amber-400 border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-lg">⚡</div>
              <div>
                <p className="text-sm font-medium text-gray-900">PikaDeal — Alerte carte trouvee</p>
                <p className="text-xs text-gray-400">alerte@pikadeal.fr · il y a 2 min</p>
              </div>
            </div>
            <p className="font-semibold text-gray-900 mb-4">Charizard Holo — Base Set 1ere ed.</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Prix annonce</p>
                <p className="font-semibold text-gray-900">38€</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Cardmarket</p>
                <p className="font-semibold text-gray-900">120€</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-green-600">Economie</p>
                <p className="font-semibold text-green-700">82€</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Vinted</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Excellente affaire</span>
              </div>
              <button className="px-3 py-1.5 bg-amber-400 text-amber-900 text-xs font-medium rounded-lg">Voir l'annonce</button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16 px-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Tarifs simples</h2>
        <p className="text-center text-gray-500 mb-10">Commence gratuitement, passe premium quand tu veux.</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="font-semibold text-gray-900 mb-1">Gratuit</p>
            <p className="text-3xl font-bold text-gray-900 mb-4">0€<span className="text-sm font-normal text-gray-400">/mois</span></p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✓ 5 cartes surveillees</li>
              <li>✓ Alertes toutes les heures</li>
              <li>✓ Vinted uniquement</li>
            </ul>
          </div>
          <div className="border-2 border-amber-400 rounded-xl p-6 shadow-sm relative">
            <span className="absolute -top-3 left-4 bg-amber-400 text-amber-900 text-xs font-medium px-3 py-1 rounded-full">Recommande</span>
            <p className="font-semibold text-gray-900 mb-1">Premium</p>
            <p className="text-3xl font-bold text-gray-900 mb-4">9€<span className="text-sm font-normal text-gray-400">/mois</span></p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✓ Cartes illimitees</li>
              <li>✓ Alertes temps reel</li>
              <li>✓ Vinted + eBay</li>
              <li>✓ Score de deal Cardmarket</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t border-gray-100 text-gray-400 text-sm">
        2025 PikaDeal — Fait avec amour pour les dresseurs
      </footer>

    </main>
  )
}