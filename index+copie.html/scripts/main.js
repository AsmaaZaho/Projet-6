
  const ready = () => {
    if (document.readyState !== 'loading') {
      console.log('test');
      init();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };
  
  const init = () => {
    console.log("test");

    const resultatRecherche = document.createElement("div");
    resultatRecherche.id = "resultat-recherche";
  
    resultatRecherche.style.display = "none";

  
    
    const button = document.createElement("button");
    button.textContent="Ajouter un livre";
    button.id = "addbutt";

    button.addEventListener("click", () => {onclick()});

    const content = document.getElementById("content");
    //content.appendChild(button);
    //add the created button like first child of element content 
    content.prepend(button);
    content.appendChild(resultatRecherche);

    function onclick() {
    console.log("click"); 
    events();
    document.getElementById("addbutt").style.display = "none";
    
    }
  };

    const events = () => {

    // function afficherFormulaire() {
      var formulaire = document.createElement("form");
      formulaire.setAttribute("method", "post");
      formulaire.setAttribute("action", "submit.php");

      const labeltitre = document.createElement("label");
      var titreDuLivre = document.createElement("input");
      titreDuLivre.setAttribute("type", "text");
      labeltitre.textContent = "Titre du livre";
      titreDuLivre.appendChild(labeltitre);


      const labelAuteur = document.createElement("label");
      var auteurDuLivre= document.createElement("input");
      auteurDuLivre.setAttribute("type", "text");
      labelAuteur.textContent = "Auteur";
      auteurDuLivre.appendChild(labelAuteur);

       // create a submit button
       var btnRechercher = document.createElement("input");
       btnRechercher.setAttribute("type", "submit");
       btnRechercher.setAttribute("value", "Rechercher");

       var btnAnnuler = document.createElement("button");
       btnAnnuler.textContent= "Annuler";

       btnAnnuler.addEventListener("click", function(event) {
        event.preventDefault(); // Annuler le comportement par défaut du formulaire
        
        // Réinitialiser le formulaire
        formulaire.reset();
        
        // Supprimer les résultats affichés
        document.getElementById("resultat-recherche").style.display = "none";

        formulaire.style.display = "none";

        document.getElementById("addbutt").style.display = "block";
        
      });

     

    // Create a break line element
    var br = document.createElement("br");

    formulaire.appendChild(labeltitre);
    formulaire.appendChild(br.cloneNode());
    formulaire.appendChild(titreDuLivre);
    formulaire.appendChild(br.cloneNode());

    formulaire.appendChild(labelAuteur);
    formulaire.appendChild(br.cloneNode());
    formulaire.appendChild(auteurDuLivre);
    formulaire.appendChild(br.cloneNode());

    formulaire.appendChild(btnRechercher);
    formulaire.appendChild(br.cloneNode());
    formulaire.appendChild(btnAnnuler);

    content.prepend(formulaire);

    formulaire.addEventListener("submit", async (event) => {
      // On empêche le comportement par défaut
    try {
        event.preventDefault();

      // On récupère les deux champs et on affiche leur valeur
      console.log("le titre du livre est : ", titreDuLivre.value);
      console.log("l'auteur de ce livre est : ", auteurDuLivre.value);
      const reponse = await fetch('https://www.googleapis.com/books/v1/volumes?q='+titreDuLivre.value+'+'+auteurDuLivre.value);
      const books = await reponse.json();
      console.log(books);
      afficherResultats(books);
      
    } catch(error) {
        console.error('Une erreur s\'est produite :', error);
     }    
  });  
 };

function afficherResultats(results) {

  
  var resultssearch = document.getElementById("resultat-recherche");
  resultssearch.querySelectorAll('*').forEach(n => n.remove());
  resultssearch.style.display = "block";

  var titreRecherche = document.createElement("h3");
  titreRecherche.textContent = "Résultats de Recherche";

  resultssearch.appendChild(titreRecherche);

    var br = document.createElement('br'); 
    resultssearch.appendChild(br.cloneNode());
  
    if (results.totalItems > 0) {
    for (i = 0; i < results.items.length; i++){
      var book = results.items[i];
      // console.log(book);
    
      var infos = {};
      infos['identifiant'] = book.id;
      infos['titre'] = book.volumeInfo.title;
      infos['auteur'] = book.volumeInfo.authors[0];
      infos['description'] = book.volumeInfo.description ? book.volumeInfo.description.substring(0, 200) + '...' : 'Pas de description disponible';
      
      var imageElement = document.createElement("img");
      imageElement.className = "imgBook";
      
      if (book.volumeInfo.imageLinks) {
        infos['image'] = book.volumeInfo.imageLinks.smallThumbnail.replace('&edge=curl', '');
        imageElement.src = infos['image'];
      }else{
        imageElement.src = "Unavailable.png"
        imageElement.width = 100; // Définir la largeur souhaitée en pixels
        imageElement.height = 100;
      }
  
      resultssearch.appendChild(imageElement);

    var bookmarkIcon = document.createElement('span');
    bookmarkIcon.className = 'bookmark';
    bookmarkIcon.innerHTML = "BOOKMARK";
    bookmarkIcon.id = book.id;

    bookmarkIcon.addEventListener("click", (event) => {
      console.log(event.target.id);
    
    // Récupérer le livre recherché
var book = event.target.id; 

// Enregistrer le livre dans la session
sessionStorage.setItem("book", book);

// Vérifier si le livre a été enregistré avec succès
if (sessionStorage.getItem("book")) {
  console.log("Le livre a été enregistré dans la session.");
} else {
  console.log("Erreur lors de l'enregistrement du livre dans la session.");
}


// if(sessionStorage.getItem('book')){
//   var books = JSON.parse(sessionStorage.getItem('book'));
//   books.forEach(element => {
//       getPreviousBook(element);
//   });
// }

var pochliste = (sessionStorage.getItem('pochliste')!=null)?JSON.parse(sessionStorage.getItem('pochliste')):[];

// Ajouter le livre à la pochliste
pochliste.push(book);

// Enregistrer la pochliste dans la session
sessionStorage.setItem("pochliste", JSON.stringify(pochliste));

// Vérifier si le livre a été ajouté avec succès à la pochliste
if (sessionStorage.getItem("pochliste")) {
  console.log(JSON.parse(sessionStorage.getItem('pochliste')));
} else {
  console.log("Erreur lors de l'ajout du livre à la pochliste.");
}
});

resultssearch.appendChild(bookmarkIcon);

// Pour récupérer la pochliste enregistrée dans une autre partie de votre code
var pochlisteEnregistree = JSON.parse(sessionStorage.getItem("pochliste"));
console.log("Pochliste enregistrée dans la session :", pochlisteEnregistree);

    // Create HTML elements for each book information
    for (var key in infos) {
      var value = infos[key];

      var labelElement = document.createElement('section');
      labelElement.textContent = key + ': ';
      labelElement.className = "label";

      var valueElement = document.createElement('section');
      valueElement.textContent = value;
      valueElement.className = "valeur";

      var br = document.createElement('br'); 

      resultssearch.appendChild(br.cloneNode());
      resultssearch.appendChild(labelElement);
      resultssearch.appendChild(valueElement);
      resultssearch.appendChild(br.cloneNode());
    }
 
  }
      // console.log(infos);
    } else {
      console.log('Livre introuvable');
      var notFoundElement = document.createElement('section');
      alert("Livre introuvable", notFoundElement);
    notFoundElement.textContent = 'Livre introuvable';
    resultssearch.appendChild(notFoundElement);
    }


}

function storageAvailable(type) {
  try {
      var storage = window[type],
          x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          storage.length !== 0;
  }
}

