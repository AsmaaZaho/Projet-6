
  const ready = () => {
    if (document.readyState !== 'loading') {
      init();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };
  
  const init = () => {

    var pochList = (sessionStorage.getItem('pochList')!=null)?JSON.parse(sessionStorage.getItem('pochList')):[];
    if(sessionStorage.getItem('pochList')){
      var books = JSON.parse(sessionStorage.getItem('pochList'));
      books.forEach(element => {
          saveBook(element);
      });
    }

    //preparing for search and pochlist
    var content = document.getElementById("content");
    var searchResults = document.createElement("div");
    searchResults.id = "resultsSearch";
    searchResults.classList = "bookContent";
    content.prepend(searchResults);
    var pochListBook = document.createElement("div");
    pochListBook.id = "pochList";
    pochListBook.classList = "bookContent";
    content.appendChild(pochListBook);

    //search form
    var searchSection = document.getElementById('myBooks');
    var sectionTitle = searchSection.querySelector('h2');
    var searchDiv = document.createElement('div');
    searchDiv.id = 'searchDiv';
    sectionTitle.after(searchDiv);

    var btnAddBook = document.createElement("button");
    btnAddBook.textContent="Ajouter un livre";
    btnAddBook.id = "addBook";
    btnAddBook.addEventListener("click", () => {
      document.getElementById("addBook").classList.add("hidden");
      document.getElementById("formDiv").classList.remove("hidden");
      slidedown();
    });
    searchDiv.appendChild(btnAddBook);

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "submit.php");
    form.id = "formDiv";
    form.classList.add('hidden');
    form.addEventListener("submit", (event) => {
      try {
        // Override the form's default behavior
        event.preventDefault();
        // We retrieve the two fields and display their value
        displayResults(bookTitle, bookauthor);
      } catch(error) {
        console.error('Une erreur s\'est produite :', error);
      }    
    });
    searchDiv.append(form);

    // Create a break line element
    var br = document.createElement("br");

    var titleDiv = document.createElement('div');
    titleDiv.id = 'titleDiv';
    const labelTitle = document.createElement("label");
    var bookTitle = document.createElement("input");
    bookTitle.setAttribute("type", "text");
    bookTitle.id = "bookTitle";
    bookTitle.required = true;
    labelTitle.textContent = "Titre du livre";
    labelTitle.className = "bookTitle";
    titleDiv.append(labelTitle);
    titleDiv.append(br.cloneNode());
    titleDiv.append(bookTitle);
    titleDiv.append(br.cloneNode());
    form.append(titleDiv);

    var authorDiv = document.createElement('div');
    authorDiv.id = 'authorDiv';
    const labelAuthor = document.createElement("label");
    var bookauthor= document.createElement("input");
    bookauthor.setAttribute("type", "text");
    bookauthor.id = "bookauthor";
    bookauthor.required = true;
    labelAuthor.textContent = "Auteur";
    labelAuthor.className = "bookauthor";
    authorDiv.append(labelAuthor);
    authorDiv.append(br.cloneNode());
    authorDiv.append(bookauthor);
    authorDiv.append(br.cloneNode());
    form.append(authorDiv);

    // create a submit button
    var btnSearch = document.createElement("button");
    btnSearch.id = "btnSearch";
    btnSearch.textContent = "Rechercher";
    btnSearch.type = 'submit';
    form.append(btnSearch);
    form.append(br.cloneNode());
    
    var cancelButton = document.createElement("button");
    cancelButton.textContent= "Annuler";
    cancelButton.classList = "cancel";
    cancelButton.id = "btnCancel";    

    cancelButton.addEventListener("click", function(event) {
      // Override the form's default behavior
      event.preventDefault(); 
      // Reset the form
      form.reset();
      // Delete displayed results
      document.getElementById("resultsSearch").classList.add("hidden");
      document.getElementById("addBook").classList.remove("hidden");
      slideup();
    });
    form.appendChild(cancelButton);
    };

  function slidedown() {
    document.getElementById("formDiv").classList.add("slide-down");
    document.getElementById("formDiv").classList.remove("slide-up");
  }
  function slideup(){
    document.getElementById("formDiv").classList.add("slide-up");
    document.getElementById("formDiv").classList.remove("slide-down");
  }
  
 
  async function displayResults(bookTitle, bookauthor) {

    const reponse = await fetch('https://www.googleapis.com/books/v1/volumes?q='+bookTitle.value+'+'+bookauthor.value);
    const books = await reponse.json();

    var resultssearch = document.getElementById("resultsSearch");
    resultssearch.classList.remove('hidden');
    resultssearch.querySelectorAll('*').forEach(n => n.remove());

    var SearchTitle = document.createElement("h2");
    SearchTitle.textContent = "Résultats de Recherche";

    resultssearch.prepend(SearchTitle);

    var br = document.createElement('br'); 
    resultssearch.appendChild(br.cloneNode());
    if (books.totalItems > 0) {
      for (i = 0; i < books.items.length; i++){
        var book = books.items[i];
        displayBook(book, true);
    }   
   } else {
      var notFoundElement = document.createElement('section');
      alert("Livre introuvable", notFoundElement);
    notFoundElement.textContent = 'Livre introuvable';
    resultssearch.appendChild(notFoundElement);
    }
}

  function addBook(book){

    if(storageAvailable('sessionStorage')) {
      var pochListTitle = document.getElementById("pochList");
      pochListTitle.querySelectorAll('*')?.forEach(n => n.remove());
      var results = document.getElementById('resultsSearch');
      var pochList = (sessionStorage.getItem('pochList')!=null)?JSON.parse(sessionStorage.getItem('pochList')):[];

      if(pochList!=null && !pochList.includes(book)){
        // add book at the pochList
        pochList.push(book);
        // save the pochList in the session
        document.getElementById(book).classList = 'bookmark far fa-trash-alt';
      }else{
        var index = pochList.indexOf(book);
        pochList.splice(index, 1);
        var searchBook = document.getElementById(book);
        if(searchBook) searchBook.classList = "bookmark fas fa-bookmark";
      }
      sessionStorage.setItem("pochList", JSON.stringify(pochList));
      pochList.forEach(element => {
        saveBook(element);
      });
      return true;
    }else{
      return false;
    }
  }

  function displayBook(book, isNew) {

    var items = JSON.parse(sessionStorage.getItem("book"));
    var itemBook = document.createElement("div");
    itemBook.classList = "book";
    itemBook.id = book.id+"div";

    var infos = {};
    infos['Titre'] = book.volumeInfo.title;
    infos['Id'] = book.id;
    infos['Auteur'] = book.volumeInfo.authors[0];
    infos['Description'] = book.volumeInfo.description ? book.volumeInfo.description.substring(0, 200) + '...' : 'Pas de description disponible';

    var imageElement = document.createElement("img");
    imageElement.classList = "imgBook";
    
    if (book.volumeInfo.imageLinks) {
      imageElement.src = book.volumeInfo.imageLinks.smallThumbnail.replace('&edge=curl', '');
    }else{
      imageElement.src = "Unavailable.png"
      imageElement.width = 100; // Définir la largeur souhaitée en pixels
      imageElement.height = 100;
    }

    var pochList = (sessionStorage.getItem('pochList')!=null)?JSON.parse(sessionStorage.getItem('pochList')):[];
    var bookmarkIcon = document.createElement('span');
    bookmarkIcon.id = book.id;
    bookmarkIcon.classList = (!pochList.includes(book.id))?"bookmark fas fa-bookmark":"bookmark far fa-trash-alt";
    var bookmarkimg = document.createElement('i');
    bookmarkimg.id = book.id;
    imageElement.appendChild(bookmarkIcon);
    bookmarkIcon.addEventListener("click", (event) =>{
      var bookId = event.currentTarget.id;
      var success = addBook(bookId);
      if(success){
        var pochList = (sessionStorage.getItem('pochList')!=null)?JSON.parse(sessionStorage.getItem('pochList')):[];
        event.currentTarget.classList = (!pochList.includes(book.id))?"bookmark fas fa-bookmark":"bookmark far fa-trash-alt";
      }
    });
    itemBook.appendChild(bookmarkIcon);

    // Create HTML elements for each book information
    for (var key in infos) {
      var value = infos[key];

      var labelElement = document.createElement('span');
      labelElement.textContent = key + ': ';
      var valueElement = document.createElement('span');
      valueElement.textContent = value;
      if(key == "Titre") {
        labelElement.classList = "bookTitle";
        valueElement.classList = "bookTitle";
      }
      if(key == "Id"){
        labelElement.classList = "bookId";
        valueElement.classList = "bookId";
      }
      var br = document.createElement('br'); 
      itemBook.appendChild(br.cloneNode());
      itemBook.appendChild(labelElement);
      itemBook.appendChild(valueElement);
      itemBook.appendChild(br.cloneNode());
      itemBook.appendChild(imageElement);
    }
    if(isNew==true){
      document.getElementById("resultsSearch").append(itemBook);
    }else{
      document.getElementById("pochList").append(itemBook);
    }
  }

async function saveBook(id) {
      var googleAPI = 'https://www.googleapis.com/books/v1/volumes/'+id;
      var response = await fetch(googleAPI);
      const book = await response.json();
      displayBook(book, false);
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
