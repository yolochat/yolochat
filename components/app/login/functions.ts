'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(email: string,password:string) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs


  const { error } = await supabase.auth.signInWithPassword({
    email:email,
    password:password
  })

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

