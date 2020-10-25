const bookAddedInfo = document.querySelectorAll(".book-added-info");
const addReadState = document.querySelectorAll(".add-read-state");
const delBookBtn = document.getElementsByClassName("delete-book");
const bookReadStatusBtns = document.getElementsByClassName("status-btn");
const addBook = document.getElementById("add-book");
const numberOfBooks = document.getElementById("numb-of-bks");
const shelf = document.getElementById("shelf");
const deleteAllBtn = document.getElementById("delete-all");
const title = bookAddedInfo[0];
const author = bookAddedInfo[1];
const pages = bookAddedInfo[2];
const searchForm = document.getElementById("search");
let read = "";

addReadState.forEach(i => i.addEventListener("click", logReadStatus));
addBook.addEventListener("click", addBookToLibrary);
deleteAllBtn.addEventListener("click", deleteAllBooks);
searchForm.addEventListener("keyup", searchForBook);

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

function logReadStatus() {
    read = this.innerText.toLowerCase();
    if(read === "not read") {
        addReadState[1].style.backgroundColor = "";
        addReadState[2].style.backgroundColor = "";
        addReadState[1].style.fontWeight = "";
        addReadState[2].style.fontWeight = "";
        this.style.backgroundColor = "#a6d608";
        this.style.fontWeight = "bold";
    } else if(read === "reading") {
        addReadState[0].style.backgroundColor = "";
        addReadState[2].style.backgroundColor = "";
        addReadState[0].style.fontWeight = "";
        addReadState[2].style.fontWeight = "";
        this.style.backgroundColor = "#9955bb";
        this.style.fontWeight = "bold";
    } else if(read === "read") {
        addReadState[0].style.backgroundColor = "";
        addReadState[1].style.backgroundColor = "";
        addReadState[0].style.fontWeight = "";
        addReadState[1].style.fontWeight = "";
        this.style.backgroundColor = "#006400";
        this.style.fontWeight = "bold";
    }
}

function addBookToLibrary() {
    const formValues = [title.value, author.value, pages.value];

    if(formValues.some(i => i === "")) {
        alert("Please fill out all the book's details");
        return;
    }
    
    if(read === "") {
        alert("Please confirm if you have read the book");
        return;
    }

    const bookDiv = document.createElement("div");

    if(read === "not read") {
        bookDiv.setAttribute("class", "unread-logged-book");
    } else if(read === "reading") {
        bookDiv.setAttribute("class", "reading-logged-book");
    } else {
        bookDiv.setAttribute("class", "read-logged-book");
    }
    
    const bookInfoDiv = document.createElement("div");
    bookInfoDiv.setAttribute("class", "book-info");
    
    const titlePEle = document.createElement("p");
    titlePEle.setAttribute("class", "logged-title");
    titlePEle.append(title.value);
    
    const authorPEle = document.createElement("p");
    authorPEle.setAttribute("class", "logged-author");
    authorPEle.append(author.value);
    
    const pagesPEle = document.createElement("p");
    pagesPEle.setAttribute("class", "logged-pages");
    pagesPEle.append(`${pages.value} pages`);
    
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

    if(read === "not read") {
        notReadButton.style.backgroundColor = "#a6d608";
        notReadButton.style.fontWeight = "bold";
    } else if(read === "reading") {
        readingButton.style.backgroundColor = "#9955bb";
        readingButton.style.fontWeight = "bold";
    } else if(read === "read") {
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

    read = "";
    title.value = "";
    author.value = "";
    pages.value = "";
    addReadState.forEach(i => {
        i.style.backgroundColor = "";
        i.style.fontWeight = "";
    });
}

function showReadStatus() {
    const clickedReadState = this.innerText.toLowerCase();
    const bookReadStateBtns = this.parentNode.children;
    const bookBackground = this.parentNode.parentNode;
    if(clickedReadState === "not read") {
        bookReadStateBtns[1].style.backgroundColor = "";
        bookReadStateBtns[2].style.backgroundColor = "";
        bookReadStateBtns[1].style.fontWeight = "";
        bookReadStateBtns[2].style.fontWeight = "";
        bookBackground.style.backgroundColor = "#a6d608";
        this.style.backgroundColor = "#a6d608";
        this.style.fontWeight = "bold";
    } else if(clickedReadState === "reading") {
        bookReadStateBtns[0].style.backgroundColor = "";
        bookReadStateBtns[2].style.backgroundColor = "";
        bookReadStateBtns[0].style.fontWeight = "";
        bookReadStateBtns[2].style.fontWeight = "";
        bookBackground.style.backgroundColor = "#9955bb";
        this.style.backgroundColor = "#9955bb";
        this.style.fontWeight = "bold";
    } else if(clickedReadState === "read") {
        bookReadStateBtns[0].style.backgroundColor = "";
        bookReadStateBtns[1].style.backgroundColor = "";
        bookReadStateBtns[0].style.fontWeight = "";
        bookReadStateBtns[1].style.fontWeight = "";
        bookBackground.style.backgroundColor = "#006400";
        this.style.backgroundColor = "#006400";
        this.style.fontWeight = "bold";
    }
}

function removeBookDiv() {
    shelf.removeChild(this.parentNode);
    numberOfBooks.innerText = shelf.children.length;
}

function deleteAllBooks() {
    if(shelf.children.length === 0) return;

    if(confirm(`Are you sure you want to delete all ${shelf.children.length} books from your Library?`)) {
        while(shelf.firstChild) {
            shelf.firstChild.remove();
        }
        numberOfBooks.innerText = shelf.children.length;
    }
}