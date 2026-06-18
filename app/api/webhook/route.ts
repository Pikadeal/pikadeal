import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.log('Webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const userId = session.client_reference_id

    if (userId) {
      await supabase.from('users').upsert({
        id: userId,
        premium: true,
      })
      console.log(`Utilisateur ${userId} passe Premium !`)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    const userId = subscription.metadata?.userId

    if (userId) {
      await supabase.from('users').update({ premium: false }).eq('id', userId)
      console.log(`Utilisateur ${userId} passe en gratuit`)
    }
  }

  return NextResponse.json({ received: true })
}