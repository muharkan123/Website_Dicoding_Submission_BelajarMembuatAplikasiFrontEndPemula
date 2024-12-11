const bookshelf = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBookList();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBookList() {
  const textTitle = document.getElementById("bookFormTitle").value;
  const textAuthor = document.getElementById("bookFormAuthor").value;
  const numberYears = document.getElementById("bookFormYear").value;
  const numberYear = parseInt(numberYears);

  const generateid = generateId();
  const bookObject = generatebookObject(generateid, textTitle, textAuthor, numberYear, false);
  bookshelf.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generatebookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("incompleteBookList");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookList");
  completedBookList.innerHTML = "";

  for (const bookItem of bookshelf) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const bookCard = document.createElement("div");
  bookCard.classList.add("card");
  bookCard.classList.add("mt-4");
  bookCard.setAttribute("data-bookid", bookObject.id);
  bookCard.setAttribute("data-testid", "bookItem");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const textTitle = document.createElement("h5");
  textTitle.classList.add("card-title");
  textTitle.innerText = bookObject.title;
  textTitle.setAttribute("data-testid", "bookItemTitle");

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis : ${bookObject.author}`;
  textAuthor.setAttribute("data-testid", "bookItemAuthor");

  const numberYear = document.createElement("p");
  numberYear.innerText = `Tahun : ${bookObject.year}`;
  numberYear.setAttribute("data-testid", "bookItemYear");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("float-end");

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("btn", "btn-success", "text-white");
    undoButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    undoButton.innerText = "Belum Selesai";

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-warning", "text-white");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.innerText = "Edit Buku";

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("btn", "btn-danger", "text-white");
    trashButton.setAttribute("data-testid", "bookItemDeleteButton");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(bookObject.id);
    });

    buttonContainer.append(undoButton, " ", editButton, " ", trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("btn", "btn-success", "text-white");
    checkButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    checkButton.innerText = "Selesai Dibaca";

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-warning", "text-white");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.innerText = "Edit Buku";

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("btn", "btn-danger", "text-white");
    trashButton.setAttribute("data-testid", "bookItemDeleteButton");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(bookObject.id);
    });

    buttonContainer.append(checkButton, " ", editButton, " ", trashButton);
  }
  cardBody.append(textTitle, textAuthor, numberYear, buttonContainer);
  bookCard.append(cardBody);
  return bookCard;
}

function editBook(bookId) {}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of bookshelf) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  bookshelf.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in bookshelf) {
    if (bookshelf[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
  alert("Data berhasil diubah");
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const books of data) {
      bookshelf.push(books);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

//Untuk mencari buku dibawah ini
const searchSubmit = document.getElementById("searchSubmit");
searchSubmit.addEventListener("click", function (event) {
  event.preventDefault();
  const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
  const daftarBuku = document.querySelectorAll("h5");

  for (const buku of daftarBuku) {
    const judulBuku = buku.innerText.toLowerCase();
    const card = buku.parentElement;

    if (judulBuku === searchInput) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
});

//Untuk mengedit buku dibawah ini
