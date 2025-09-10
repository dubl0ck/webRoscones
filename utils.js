import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "https://zxipywyhobtlxaaerazi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aXB5d3lob2J0bHhhYWVyYXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzE5ODYsImV4cCI6MjA3MjkwNzk4Nn0.YB_mgNKRBrJ8-Z7jnT5_xeQV0zrmAiRqVZ8JqgLxjVs";
export const supabase = createClient(supabaseUrl, supabaseKey);

// Chequear sesión
export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Si no hay sesión → volver al login
    window.location.href = "index.html";
  }
}

document.getElementById("logout")?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "index.html";
});