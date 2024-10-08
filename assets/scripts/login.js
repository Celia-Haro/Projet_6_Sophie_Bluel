// Page de connexion, gestion de la connexion

import { showError } from "./error.js";

const form = document.querySelector(".form-login");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = {
    email: document.querySelector("#email").value,
    password: document.querySelector("#password").value,
  };

  const fetchUser = fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userId),
  });

  fetchUser.then(async (response) => {
    try {
      const body = await response.json();
      console.log(body);
      if (response.ok) {
        localStorage.setItem("token", body.token);
        window.location.href = "../../index.html";
      } else {
        const message = "Erreur dans l’identifiant ou le mot de passe";
        showError(message);
      }
    } catch (error) {
      const message = "Une erreur s'est produite lors de la connexion";
      showError(message);
    }
  });
});
