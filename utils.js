// utils.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "https://zxipywyhobtlxaaerazi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."; // tu anon key
export const supabase = createClient(supabaseUrl, supabaseKey);

// Verifica si hay sesión activa, si no → redirige al login
export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
  }
}

// Cerrar sesión
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}
