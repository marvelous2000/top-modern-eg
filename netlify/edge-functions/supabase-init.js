export default async (request, context) => {
  // This edge function runs on every request to ensure Supabase environment variables are available
  // Netlify automatically provides environment variables to edge functions

  const supabaseUrl = Netlify.env.get('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseKey = Netlify.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables not found in Netlify environment')
    // Continue with the request anyway - the app will handle missing env vars gracefully
  }

  // Add headers to indicate Supabase is configured
  const response = await context.next()
  response.headers.set('X-Supabase-Configured', supabaseUrl ? 'true' : 'false')

  return response
}

export const config = {
  path: '/*'
}
