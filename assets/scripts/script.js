import { generateModalGallery } from "./modal.js";
import { generateModalCat } from "./modal.js";
import { showError } from "./error.js";

// Récupérer les données du back via l'API + générer les projets  et les catégories dans la galerie

export const fetchWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    console.log(
      "Une erreur est survenue dans le processus de récupération des données des projets"
    );
    const message =
      "Un problème est survenu dans le processus de récupération des données des projets";
    showError(message);
  }
};

export const generateProjects = (works) => {
  const gallery = document.querySelector("#portfolio .gallery");
  gallery.innerHTML = "";
  for (let i = 0; i < works.length; i++) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    image.setAttribute("src", works[i].imageUrl);
    figure.appendChild(image);

    const titleFigure = document.createElement("figcaption");
    titleFigure.innerText = works[i].title;
    figure.appendChild(titleFigure);

    gallery.appendChild(figure);
  }
};

fetchWorks().then(async (works) => {
  const categories = await fetchCategories();
  generateProjects(works);
  generateCategories(categories, works);
  generateModalGallery(works);
  generateModalCat(categories);
});

const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  } catch (error) {
    console.log(
      "Une erreur est survenue dans le processus de récupération des données des catégories"
    );
    const message =
      "Un problème est survenu dans le processus de récupération des données des catégories";
    showError(message);
  }
};

const filtersContainer = document.querySelector("#portfolio .filters");

const generateCategories = (categories, works) => {
  for (const category of categories) {
    const addFilterBtn = document.createElement("button");
    addFilterBtn.classList.add("filter");
    addFilterBtn.innerText = category.name;
    addFilterBtn.setAttribute("id", category.id);
    filtersContainer.appendChild(addFilterBtn);
  }
  const allFilters = document.querySelectorAll(".filters .filter");
  filterWorks(allFilters, works);
};

// Trier les catégories avec les boutons

const filterWorks = (allFilters, works) => {
  allFilters.forEach((filterBtn) => {
    filterBtn.addEventListener("click", (e) => {
      allFilters.forEach((btn) => {
        btn.classList.remove("active");
      });
      e.currentTarget.classList.add("active");

      const categoryId = e.currentTarget.id;

      if (categoryId === "0") {
        generateProjects(works);
      } else {
        const worksFiltered = works.filter((work) => {
          return work.categoryId.toString() === categoryId;
        });
        generateProjects(worksFiltered);
      }
    });
  });
};

// Gestion de la connexion et du mode édition

let userConnected = !!localStorage.getItem("token");

const toggleLoginOut = () => {
  const log = document.getElementById("logInOut");
  if (userConnected) {
    log.innerText = "logout";
  } else {
    log.innerText = "login";
  }
  log.addEventListener("click", () => {
    if (userConnected) {
      localStorage.removeItem("token");
      userConnected = false;
      log.innerText = "login";
      toggleEditionMode();
    } else {
      log.setAttribute("href", "./assets/pages/login.html");
    }
  });
};

toggleLoginOut();

const toggleEditionMode = () => {
  const editionBanner = document.getElementById("edition-banner");
  const modalBtn = document.getElementById("btn-modal");
  if (userConnected) {
    editionBanner.classList.remove("disabled");
    modalBtn.classList.remove("disabled");
    filtersContainer.classList.add("disabled");
  } else {
    editionBanner.classList.add("disabled");
    modalBtn.classList.add("disabled");
    filtersContainer.classList.remove("disabled");
  }
};

toggleEditionMode(userConnected);
