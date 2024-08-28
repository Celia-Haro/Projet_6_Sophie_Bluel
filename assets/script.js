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
