import { supabase } from "./utils.js";

const form = document.getElementById("login-form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    mensaje.textContent = "Error: " + error.message;
  } else {
    mensaje.style.color = "green";
    mensaje.textContent = "Login exitoso 🎉";
    window.location.href = "clientes.html";
  }
});
