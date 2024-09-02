// Récupérer les données du back via l'API + appeler la fonction genererProjet
let works;

const fetchWorks = async () => {
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

const generateProjects = (works) => {
  const gallery = document.querySelector("#portfolio .gallery");
  gallery.innerHTML = "";
  for (i = 0; i < works.length; i++) {
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

// Générer les boutons Catégories
const generateCategories = (categories, works) => {
  const btnFilters = document.querySelector("#portfolio .filters");

  for (const category of categories) {
    const btnFilter = document.createElement("button");
    btnFilter.classList.add("filter");
    btnFilter.innerText = category.name;
    btnFilter.setAttribute("id", category.id);
    btnFilters.appendChild(btnFilter);
    filterWorks(btnFilter, works, category.id);
  }
};

// Trier les catégories avec les boutons
const filterWorks = (btnFilter, works, categoryId) => {
  btnFilter.addEventListener("click", () => {
    // Enlever la classe active de tous les boutons
    const allFilters = document.querySelectorAll(".filter");
    allFilters.forEach((btn) => {
      btn.classList.remove("active");
    });
    // Ajouter la classe active sur le bouton cliqué
    btnFilter.classList.add("active");
    const worksFiltered = works.filter((work) => {
      return work.categoryId === categoryId;
    });
    generateProjects(worksFiltered);
  });
};
