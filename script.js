const bookAddedInfo = document.querySelectorAll(".book-added-info");
const addReadState = document.querySelectorAll(".add-read-state");
const addBook = document.getElementById("add-book");
const numberOfBooks = document.getElementById("numb-of-bks");
const searchForm = document.getElementById("search");
const deleteAllBtn = document.getElementById("delete-all");
const shelf = document.getElementById("shelf");
const delBookBtn = document.getElementsByClassName("delete-book");
const bookReadStatusBtns = document.getElementsByClassName("status-btn");
const deleteAllModalBg = document.getElementById("del-all-modal-bg");
const closeModalBtn = document.getElementById("close-modal");
const deleteAllConfirmationText = document.getElementById("del-all-conf-text");
const deleteAllOkayBtn = document.getElementById("delete-all-okay");
const cancelDelAllReqBtn = document.getElementById("cancel-del-all-request");
const title = bookAddedInfo[0];
const author = bookAddedInfo[1];
const pages = bookAddedInfo[2];
let rStatus = "";
let bookInfoObj = {};

// localStorage.clear();

window.addEventListener("load", checkLocalStorage);
addReadState.forEach(i => i.addEventListener("click", logReadStatus));
addBook.addEventListener("click", createBookInfoObj);
searchForm.addEventListener("keyup", searchForBook);
deleteAllBtn.addEventListener("click", confirmDelAllRequest);
window.addEventListener("click", closeDelAllModalBox);
deleteAllOkayBtn.addEventListener("click", deleteAllBooks);

function checkLocalStorage() {
    if(localStorage.length > 0) {
        for(let i = 0; i < localStorage.length; i++){
            const keyOfBook = localStorage.key(i);
            const bookFromLocalStorage = localStorage.getItem(keyOfBook);
            const turnJSONBookToJSBook = JSON.parse(bookFromLocalStorage);
            console.log(turnJSONBookToJSBook);
            addBookToLibrary(turnJSONBookToJSBook);
        }
    }
}

function createBookInfoObj() {
    const bookData = {
        title: title.value,
        author: author.value,
        pages: pages.value,
        rStatus: rStatus
    }
    for(const prop in bookData) {
        if(bookData[prop] === "") {
            alert("Please provide all the book's details");
            return;
        }
    }
    bookInfoObj = bookData;
    console.log(bookInfoObj.title);
    // Store book's data into the Local-Storage:
    console.log(JSON.stringify(bookInfoObj));
    localStorage.setItem(bookInfoObj.title, JSON.stringify(bookInfoObj));
    // Add book to Library's shelf:
    addBookToLibrary(bookInfoObj);
}

function logReadStatus() {
    rStatus = this.innerText.toLowerCase();
    if(rStatus === "not read") {
        addReadState[1].style.backgroundColor = "";
        addReadState[2].style.backgroundColor = "";
        addReadState[1].style.fontWeight = "";
        addReadState[2].style.fontWeight = "";
        this.style.backgroundColor = "#a6d608";
        this.style.fontWeight = "bold";
    } else if(rStatus === "reading") {
        addReadState[0].style.backgroundColor = "";
        addReadState[2].style.backgroundColor = "";
        addReadState[0].style.fontWeight = "";
        addReadState[2].style.fontWeight = "";
        this.style.backgroundColor = "#9955bb";
        this.style.fontWeight = "bold";
    } else if(rStatus === "read") {
        addReadState[0].style.backgroundColor = "";
        addReadState[1].style.backgroundColor = "";
        addReadState[0].style.fontWeight = "";
        addReadState[1].style.fontWeight = "";
        this.style.backgroundColor = "#006400";
        this.style.fontWeight = "bold";
    }
}

function addBookToLibrary(bookInfoObject) {
    // Create Book's card for display on the shelf:
    const bookDiv = document.createElement("div");

    if(bookInfoObject.rStatus === "not read") {
        bookDiv.setAttribute("class", "unread-logged-book");
    } else if(bookInfoObject.rStatus === "reading") {
        bookDiv.setAttribute("class", "reading-logged-book");
    } else {
        bookDiv.setAttribute("class", "read-logged-book");
    }
    
    const bookInfoDiv = document.createElement("div");
    bookInfoDiv.setAttribute("class", "book-info");
    
    const titlePEle = document.createElement("p");
    titlePEle.setAttribute("class", "logged-title");
    titlePEle.append(bookInfoObject.title);
    
    const authorPEle = document.createElement("p");
    authorPEle.setAttribute("class", "logged-author");
    authorPEle.append(bookInfoObject.author);
    
    const pagesPEle = document.createElement("p");
    pagesPEle.setAttribute("class", "logged-pages");
    pagesPEle.append(`${bookInfoObject.pages} pages`);
    
    bookInfoDiv.append(titlePEle, authorPEle, pagesPEle);
    
    const readStatusDiv = document.createElement("div");
    readStatusDiv.setAttribute("class", "logged-read-status");
    
    const notReadButton = document.createElement("button");
    notReadButton.setAttribute("type", "button");
    notReadButton.classList.add("status-btn", "not-read");
    notReadButton.append("Not Read");
    
    const readingButton = document.createElement("button");
    readingButton.setAttribute("type", "button");
    readingButton.classList.add("status-btn", "reading");
    readingButton.append("Reading");
    
    const readButton = document.createElement("button");
    readButton.setAttribute("type", "button");
    readButton.classList.add("status-btn", "read");
    readButton.append("Read");

    console.log(`I am ${rStatus}`);

    if(bookInfoObject.rStatus === "not read") {
        notReadButton.style.backgroundColor = "#a6d608";
        notReadButton.style.fontWeight = "bold";
    } else if(bookInfoObject.rStatus === "reading") {
        readingButton.style.backgroundColor = "#9955bb";
        readingButton.style.fontWeight = "bold";
    } else if(bookInfoObject.rStatus === "read") {
        readButton.style.backgroundColor = "#006400";
        readButton.style.fontWeight = "bold";
    }
    
    readStatusDiv.append(notReadButton, readingButton, readButton);
    
    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("class", "delete-book");
    
    const trashIcon = document.createElement("i");
    trashIcon.setAttribute("class", "fas fa-trash-alt");
    
    deleteBtn.appendChild(trashIcon);
    
    bookDiv.append(bookInfoDiv, readStatusDiv, deleteBtn);
    
    shelf.appendChild(bookDiv);

    numberOfBooks.innerText = shelf.children.length;

    for(let i=0; i < bookReadStatusBtns.length; i++) {
        bookReadStatusBtns[i].addEventListener("click", showReadStatus)
    }

    for(let i=0; i < delBookBtn.length; i++) {
        delBookBtn[i].addEventListener("click", removeBookDiv)
    }

    rStatus = "";
    title.value = "";
    author.value = "";
    pages.value = "";
    addReadState.forEach(i => {
        i.style.backgroundColor = "";
        i.style.fontWeight = "";
    });
}

function showReadStatus(clickedBtn) {
    const clickedReadState = this.innerText.toLowerCase();
    const bookReadStateBtns = this.parentNode.children;
    const bookBackground = this.parentNode.parentNode;
    const bookInfoDiv = clickedBtn.composedPath()[2].children[0];
    const bookTitle = bookInfoDiv.firstElementChild.innerText;
    const bookFromLocalStorage = localStorage.getItem(bookTitle);
    let bookFrLocStorReplacement = "";

    if(clickedReadState === "not read") {
        changeBookStatToNotRead();
        bookReadStateBtns[1].style.backgroundColor = "";
        bookReadStateBtns[2].style.backgroundColor = "";
        bookReadStateBtns[1].style.fontWeight = "";
        bookReadStateBtns[2].style.fontWeight = "";
        bookBackground.style.backgroundColor = "#a6d608";
        this.style.backgroundColor = "#a6d608";
        this.style.fontWeight = "bold";
    } else if(clickedReadState === "reading") {
        changeBookStatToReading();
        bookReadStateBtns[0].style.backgroundColor = "";
        bookReadStateBtns[2].style.backgroundColor = "";
        bookReadStateBtns[0].style.fontWeight = "";
        bookReadStateBtns[2].style.fontWeight = "";
        bookBackground.style.backgroundColor = "#9955bb";
        this.style.backgroundColor = "#9955bb";
        this.style.fontWeight = "bold";
    } else if(clickedReadState === "read") {
        changeBookStatToRead();
        bookReadStateBtns[0].style.backgroundColor = "";
        bookReadStateBtns[1].style.backgroundColor = "";
        bookReadStateBtns[0].style.fontWeight = "";
        bookReadStateBtns[1].style.fontWeight = "";
        bookBackground.style.backgroundColor = "#006400";
        this.style.backgroundColor = "#006400";
        this.style.fontWeight = "bold";
    }

    function changeBookStatToNotRead() {
        if(bookFromLocalStorage.match(/(reading)|(read)/)) {
            bookFrLocStorReplacement = bookFromLocalStorage.replace(/(reading)|(read)/, "not read");
            localStorage.setItem(bookTitle, bookFrLocStorReplacement);
        }
    }

    function changeBookStatToReading() {
        if(bookFromLocalStorage.match(/(not read)|(read)/)) {
            bookFrLocStorReplacement = bookFromLocalStorage.replace(/(not read)|(read)/, "reading");
            localStorage.setItem(bookTitle, bookFrLocStorReplacement);
        }
    }

    function changeBookStatToRead() {
        if(bookFromLocalStorage.match(/(not read)|(reading)/)) {
            bookFrLocStorReplacement = bookFromLocalStorage.replace(/(not read)|(reading)/, "read");
            localStorage.setItem(bookTitle, bookFrLocStorReplacement);
        }
    }
}

function removeBookDiv() {
    const bookTitle = this.parentNode.firstElementChild.firstElementChild.innerText;
    localStorage.removeItem(bookTitle);
    shelf.removeChild(this.parentNode);
    numberOfBooks.innerText = shelf.children.length;
}

function searchForBook() {
    const searchValue = searchForm.value.toLowerCase();
    const books = shelf.children;
    for(let i=0; i < books.length; i++) {
        const titlePEle = books[i].querySelector(".logged-title");
        if(titlePEle.innerText.toLowerCase().indexOf(searchValue) > -1) {
            books[i].style.display = "";
        } else {
            books[i].style.display = "none";
        }
    }
}

function confirmDelAllRequest() {
    if(shelf.children.length === 0) return;
    if(shelf.children.length === 1) {
        deleteAllConfirmationText.innerHTML = `Are you sure you want to <strong>permanently delete this book</strong> from your Library?`;
    } else {
        deleteAllConfirmationText.innerHTML = `Are you sure you want to <strong>permanently delete all ${shelf.children.length} books</strong> from your Library?`;
    }
    deleteAllModalBg.style.display = "block";
}

function closeDelAllModalBox(objClicked) {
    if(objClicked.target === deleteAllModalBg || objClicked.target === closeModalBtn || objClicked.target === cancelDelAllReqBtn) {
        deleteAllModalBg.style.display = "none";
    }
}

function deleteAllBooks() {
    localStorage.clear();
    bookInfoObj = {};
    while(shelf.firstChild) {
        shelf.firstChild.remove();
    }
    numberOfBooks.innerText = shelf.children.length;
    deleteAllModalBg.style.display = "none";
}