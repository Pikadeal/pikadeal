import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ premium: false })
    }

    const { data } = await supabase
      .from('users')
      .select('premium')
      .eq('id', userId)
      .maybeSingle()

    return NextResponse.json({ premium: data?.premium || false })

  } catch (error: any) {
    return NextResponse.json({ premium: false })
  }
}