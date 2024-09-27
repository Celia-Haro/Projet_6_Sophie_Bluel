// Gestion des erreurs

export function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error-message");
  errorDiv.textContent = message;

  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 4000);
}
