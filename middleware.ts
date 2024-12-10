import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
    // update user's auth session
    let supabaseResponse = await updateSession(request)

    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        // If user is not authenticated, redirect to login page
        return NextResponse.redirect(new URL('/login', request.url))
    }



    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|login|error|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}