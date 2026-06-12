import type { Metadata } from 'next'
import { ClerkProvider, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'PikaDeal — Ne rate plus jamais une bonne affaire Pokemon',
  description: 'PikaDeal surveille Vinted et eBay 24h/24',
}

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