const modalLayout = document.getElementById("modal");
const modals = [
  document.getElementById("modal1"),
  document.getElementById("modal2"),
];
const btnOpenModal = document.getElementById("btn-modal");
const btnOpenModal2 = document.getElementById("btn-modal2");

btnOpenModal.addEventListener("click", () => openModal(modals[0]));
btnOpenModal2.addEventListener("click", (e) => {
  e.stopPropagation();
  switchModal(modals[0], modals[1]);
});

modalLayout.addEventListener("click", closeAllModals);

modals.forEach((modal) => {
  const closeButtons = modal.querySelectorAll(".close-modal");
  closeButtons.forEach((btn) => btn.addEventListener("click", closeAllModals));
  modal.addEventListener("click", (e) => e.stopPropagation());
});

function openModal(modal) {
  modalLayout.classList.remove("disabled");
  modal.classList.remove("disabled");
}

function closeAllModals() {
  modalLayout.classList.add("disabled");
  modals.forEach((modal) => modal.classList.add("disabled"));
}

function switchModal(currentModal, nextModal) {
  closeModal(currentModal);
  openModal(nextModal);
}

function closeModal(modal) {
  modal.classList.add("disabled");
}

// Navigation entre modales
document.querySelector(".previous-modal")?.addEventListener("click", (e) => {
  e.stopPropagation();
  switchModal(modals[1], modals[0]);
});
