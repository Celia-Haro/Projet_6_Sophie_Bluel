// Récupérer les données du back via l'API + appeler la fonction genererProjet

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

fetchWorks().then((works) => generateProjects(works));

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

// Générer les boutons dynamiquement

const generateCategories = (categories) => {
  const filters = document.querySelector("#portfolio .filters");

  for (i = 0; i < categories.length; i++) {
    const filter = document.createElement("button");
    filter.classList.add("filter");
    filter.innerText = categories[i].name;
    filter.setAttribute("id", categories[i].id);
    filters.appendChild(filter);
    console.log(categories);

    filter.addEventListener("click", () => {
      // Enlever la classe active de tous les boutons
      const allFilters = document.querySelectorAll(".filter");
      allFilters.forEach((btn) => {
        btn.classList.remove("active");
      });

      // Ajouter la classe active sur le bouton cliqué
      filter.classList.add("active");
      console.log("Bouton cliqué : ", filter.innerText);
    });
  }
};

fetchCategories().then((categories) => generateCategories(categories));
