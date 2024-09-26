import { fetchWorks } from "../script.js";
import { generateProjects } from "../script.js";
import { works } from "../script.js";

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

      const confirmation = confirm(
        "Êtes-vous sûr de vouloir supprimer ce projet ?"
      );
      if (!confirmation) {
        return;
      }
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

// Gestion de modal2: récupérer les catégories

// Cette fonction est appelée dans script.js, à la suite de fetchWorks l.37

export const generateModalCat = (categories, works) => {
  for (const category of categories) {
    const selectCat = document.querySelector(".form-bloc select");
    const optionCat = document.createElement("option");
    optionCat.value = category.name;
    optionCat.innerText = category.name;
    optionCat.id = category.id;
    selectCat.appendChild(optionCat);
  }
};

// Gestion de modal2: picture-input

const pictureInput = document.getElementById("picture");
const pictureContainer = document.querySelector(".picture-input");
const pictureContentInfo = pictureContainer.innerHTML;

pictureInput.addEventListener("change", () => {
  const file = pictureInput.files[0];
  const maxSize = 4 * 1024 * 1024; // 4 Mo en octets

  if (
    file &&
    (file.type === "image/jpeg" || file.type === "image/png") &&
    file.size < maxSize
  ) {
    const reader = new FileReader();
    reader.onload = (e) => {
      pictureContainer.innerHTML = `<img src=" ${e.target.result}" alt ="${e.target.name}" ></img>`;
    };
    reader.readAsDataURL(file);
  } else {
    alert(
      "L'image doit être au format  JPEG ou PNG et ne doit pas dépasser 4 Mo"
    );
    pictureContainer.innerHTML = pictureContentInfo;
    pictureInput.value = "";
    return;
  }
});

// Gestion modal2: Vérification des champs du formulaire, activation de submit

const form = document.querySelector(".modal-form");
const submitButton = document.querySelector(".modal-form-submit");

form.addEventListener("input", () => {
  const file = pictureInput.files[0];
  const title = document.querySelector('input[name="title"]').value;
  const category = document.querySelector('select[name="categories"]').value;

  if (file && title.trim() !== "" && category.trim() !== "") {
    submitButton.classList.remove("unactive");
  } else {
    submitButton.classList.add("unactive");
  }
});

// Gestion du submit !!!

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitButton.classList.contains("unactive")) {
    alert(
      "Vous devez remplir tous les champs du formulaire pour pouvoir envoyer un projet"
    );
  } else {
    const userToken = localStorage.getItem("token");

    const formData = new FormData();
    const image = pictureInput.files[0];
    const title = document.getElementById("form-title").value;

    const categorySelect = document.querySelector(".form-bloc select");
    const selectedOption = categorySelect.selectedOptions[0];
    const categoryId = parseInt(selectedOption.getAttribute("id"), 10);

    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    console.log(userToken);
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        function clearFormFields() {
          pictureContainer.innerHTML = pictureContentInfo;
          form.reset();
        }

        alert("Le projet a été ajouté avec succès");
        fetchWorks().then(async (works) => {
          generateModalGallery(works);
          generateProjects(works);
          clearFormFields();
          switchModal(modals[1], modals[0]);
          closeModal(modal);
        });
      }
    } catch (error) {
      if (error.status === 400) {
        alert("Une erreur s'est produite. Veuillez vérifier vos données.");
      } else if (error.status === 401) {
        alert(
          "Vous n'êtes pas autorisé à effectuer cette action. Votre session a expiré, veuillez vous reconnecter."
        );
      } else if (error.status === 500) {
        alert(
          "Une erreur interne du serveur s'est produite. Veuillez réessayer plus tard."
        );
      } else {
        alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
      }
    }
  }
});
