import { fetchWorks } from "./script.js";
import { generateProjects } from "./script.js";
import { works } from "./script.js";

// Open / close / switch modal
const modalLayout = document.getElementById("modal");
const modals = [
  document.getElementById("modal1"),
  document.getElementById("modal2"),
];
const btnOpenModal = document.getElementById("btn-modal");
const btnOpenModal2 = document.getElementById("btn-modal2");

btnOpenModal.addEventListener("click", () => {
  openModal(modals[0]);
});
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

document.querySelector(".previous-modal")?.addEventListener("click", (e) => {
  e.stopPropagation();
  switchModal(modals[1], modals[0]);
});

// Gestion  de modal1 : générer modalGallery

// Cette fonction est appelée dans script.js, à la suite de fetchWorks l.37

export const generateModalGallery = (works) => {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";
  for (let i = 0; i < works.length; i++) {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = works[i].imageUrl;
    image.alt = works[i].title;
    image.classList.add("modal-image");

    const deleteContainer = document.createElement("div");
    deleteContainer.classList.add("delete-container");

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("delete-icon", "fa-solid", "fa-trash-can");
    deleteIcon.setAttribute("id", works[i].id);

    modalGallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(deleteContainer);
    deleteContainer.appendChild(deleteIcon);
  }

  deleteProjects(works);
};

// Gestion de modal1 : deleteProject

const deleteProjects = () => {
  const allDeleteIcons = document.querySelectorAll(".delete-icon");
  allDeleteIcons.forEach((icon) => {
    icon.addEventListener("click", async (e) => {
      e.stopPropagation();
      const projectId = e.currentTarget.id;
      const userToken = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${projectId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (response.ok) {
          fetchWorks().then(async (works) => {
            generateModalGallery(works);
            generateProjects(works);
          });
        } else {
          console.log("Erreur lors de la suppression du projet");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      }
    });
  });
};
