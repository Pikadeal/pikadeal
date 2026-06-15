export default function CGU() {
  return (
    <main className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 font-bold text-sm">P</div>
          <span className="font-semibold text-gray-900 text-lg">PikaDeal</span>
        </a>
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600">Retour</a>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Generales d'Utilisation</h1>
        <p className="text-gray-400 text-sm mb-10">Derniere mise a jour : juin 2025</p>

        <div className="space-y-8 text-gray-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Presentation du service</h2>
            <p>PikaDeal est un service d'alertes automatiques permettant aux collectionneurs de cartes Pokemon de surveiller les plateformes Vinted et eBay et de recevoir des notifications par email lorsque des cartes correspondent a leurs criteres de recherche.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Acces au service</h2>
            <p>L'acces au service PikaDeal necessite la creation d'un compte utilisateur. Le service est disponible en version gratuite (limitee a 5 cartes surveillees) et en version Premium (9 EUR/mois, cartes illimitees et acces a toutes les plateformes).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Abonnement et paiement</h2>
            <p>L'abonnement Premium est facture mensuellement via Stripe. Vous pouvez resilier votre abonnement a tout moment depuis votre espace personnel. La resiliation prend effet a la fin de la periode d'abonnement en cours. Aucun remboursement n'est effectue pour les periodes deja facturees.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Donnees personnelles</h2>
            <p>PikaDeal collecte uniquement les donnees necessaires au fonctionnement du service : adresse email, preferences de recherche. Ces donnees ne sont jamais vendues a des tiers. Conformement au RGPD, vous disposez d'un droit d'acces, de rectification et de suppression de vos donnees. Pour exercer ces droits, contactez-nous via la page contact.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Limitation de responsabilite</h2>
            <p>PikaDeal est un service d'alertes et n'est pas responsable des transactions effectuees sur Vinted ou eBay. Nous ne garantissons pas la disponibilite permanente des annonces detectees. Les prix affiches sont ceux indiques par les vendeurs au moment de la detection.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Propriete intellectuelle</h2>
            <p>Le nom PikaDeal, son logo et l'ensemble du contenu du site sont proteges. Les noms et images des cartes Pokemon appartiennent a leurs proprietaires respectifs (Nintendo, The Pokemon Company). PikaDeal n'est pas affilie a Nintendo ou The Pokemon Company.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Modification des CGU</h2>
            <p>PikaDeal se reserve le droit de modifier les presentes CGU a tout moment. Les utilisateurs seront informes par email en cas de modification substantielle.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Contact</h2>
            <p>Pour toute question concernant ces CGU, contactez-nous via notre <a href="/contact" className="text-amber-600 hover:underline">page contact</a>.</p>
          </section>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t border-gray-100 text-gray-400 text-sm mt-12">
        <div className="flex justify-center gap-6 mb-3">
          <a href="/contact" className="hover:text-gray-600">Contact</a>
          <a href="/cgu" className="hover:text-gray-600">CGU</a>
          <a href="/dashboard" className="hover:text-gray-600">Mon compte</a>
        </div>
        2025 PikaDeal — Fait avec amour pour les dresseurs
      </footer>

    </main>
  )
}