import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "TU_SUPABASE_URL";
const supabaseKey = "TU_SUPABASE_ANON_KEY";
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

    // Redirigir a otra página
    // window.location.href = "dashboard.html";
  }
});
