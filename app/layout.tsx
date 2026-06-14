import type { Metadata } from 'next'
import { ClerkProvider, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'PikaDeal — Ne rate plus jamais une bonne affaire Pokemon',
  description: 'PikaDeal surveille Vinted et eBay 24h/24 et t\'envoie un email des qu\'une carte Pokemon de ta liste apparait sous le prix Cardmarket. Alertes automatiques, toutes les cartes FR/EN/JP.',
  keywords: 'carte pokemon, vinted pokemon, ebay pokemon, alerte carte pokemon, bonne affaire pokemon, dracaufeu, pikachu, mewtwo',
  openGraph: {
    title: 'PikaDeal — Alertes cartes Pokemon',
    description: 'Ne rate plus jamais une bonne affaire sur Vinted et eBay',
    url: 'https://pikadeal.vercel.app',
    siteName: 'PikaDeal',
    locale: 'fr_FR',
    type: 'website',
  },
}verification: {
  google: '<meta name="google-site-verification" content="dN1CueH4CdEqT-Ksy2AFJYhuVTefQzK0wjiBjk027M8" />
',
},

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <ClerkProvider>
          <div className="flex justify-end gap-3 px-8 py-3 border-b border-gray-100">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Connexion
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm bg-amber-400 text-amber-900 font-medium rounded-lg hover:bg-amber-500">
                Essai gratuit
              </button>
            </SignUpButton>
            <UserButton />
          </div>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
