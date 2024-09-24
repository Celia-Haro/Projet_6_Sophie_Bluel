// Récupérer les données du back via l'API + appeler la fonction genererProjet
export let works;
import { generateModalGallery } from "./modal.js";

export const fetchWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    console.log(
      "Une erreur est survenue dans le processus de récupération des données des works"
    );
    alert("Un problème de serveur est survenu");
  }
};

// Création de la fonction pour générer les projets dynamiquement

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
});

// Fetch pour récupérer les catégories

const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  } catch (error) {
    console.log(
      "Une erreur est survenue dans le processus de récupération des données des categories"
    );
    alert("Un problème de serveur est survenu");
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

// Gestion de le connexion
const userConnected = localStorage.getItem("token");

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
      window.location.reload();
    } else {
      log.setAttribute("href", "./assets/login.html");
    }
  });
};

toggleLoginOut();

// Gestion du mode édition
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
