import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "https://zxipywyhobtlxaaerazi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aXB5d3lob2J0bHhhYWVyYXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzE5ODYsImV4cCI6MjA3MjkwNzk4Nn0.YB_mgNKRBrJ8-Z7jnT5_xeQV0zrmAiRqVZ8JqgLxjVs";
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById("login-form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    mensaje.textContent = "Error: " + error.message;
  } else {
    mensaje.style.color = "green";
    mensaje.textContent = "Login exitoso 🎉";
    console.log("Usuario:", data.user);

    window.location.href = "clientes.html";
  }
});

