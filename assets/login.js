// Page de connexion, gestion de la connexion

const form = document.querySelector(".form-login");

form.addEventListener("submit", function (event) {
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
      // window.location.href = "../index.html";
    } catch (error) {
      console.log("Une erreur s'est produite lors de la connexion");
    }
  });
});
