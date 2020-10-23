const bookAddedInfo = document.querySelectorAll(".book-added-info");
const addReadState = document.querySelectorAll(".add-read-state");
const booksOnShelf = document.getElementsByClassName("bk");
const booksDelBtn = document.getElementsByClassName("delete-book");
const addBook = document.getElementById("add-book");
const shelf = document.getElementById("shelf");
const title = bookAddedInfo[0];
const author = bookAddedInfo[1];
const pages = bookAddedInfo[2];
let read = "";

// let library = [
//     {
//         title: "Hobbit",
//         author: "J.R.R. Tolkien",
//         pages: 295,
//         readStatus: "Not read"
//     },
//     {
//         title: "To Kill a Mockingbird",
//         author: "Harper Lee",
//         pages: 56,
//         readStatus: "Read"
//     },
//     {
//         title: "Harry Potter and the Philosopher’s Stone",
//         author: "J.K. Rowling",
//         pages: 100,
//         readStatus: "Reading"
//     }
// ];

addReadState.forEach(i => i.addEventListener("click", logReadStatus));
addBook.addEventListener("click", addBookToLibrary);

function deleteBook(i) {
    const bookIndex = booksDelBtnArray.indexOf(i);
    console.log(bookIndex);
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

    // library.push({
    //     title: title.value,
    //     author: author.value,
    //     pages: pages.value,
    //     readStatus: read
    // });

    const bookDiv = document.createElement("div");

    if(read === "not read") {
        bookDiv.classList.add("bk", "unread-logged-book");
    } else if(read === "reading") {
        bookDiv.classList.add("bk", "reading-logged-book");
    } else {
        bookDiv.classList.add("bk", "read-logged-book");
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
    notReadButton.setAttribute("class", "not-read");
    notReadButton.append("Not Read");
    
    const readingButton = document.createElement("button");
    readingButton.setAttribute("type", "button");
    readingButton.setAttribute("class", "reading");
    readingButton.append("Reading");
    
    const readButton = document.createElement("button");
    readButton.setAttribute("type", "button");
    readButton.setAttribute("class", "read");
    readButton.append("Read");
    
    readStatusDiv.append(notReadButton, readingButton, readButton);
    
    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("class", "delete-book");
    
    const trashIcon = document.createElement("i");
    trashIcon.setAttribute("class", "fas fa-trash-alt");
    
    deleteBtn.appendChild(trashIcon);
    
    bookDiv.append(bookInfoDiv, readStatusDiv, deleteBtn);
    
    shelf.appendChild(bookDiv);

    for(let i=0; i < booksDelBtn.length; i++) {
        booksDelBtn[i].addEventListener("click", removeBookDiv)
    }

    read = "";
    title.value = "";
    author.value = "";
    pages.value = "";
    addReadState[0].style.backgroundColor = "";
    addReadState[1].style.backgroundColor = "";
    addReadState[2].style.backgroundColor = "";
}


function removeBookDiv() {
    console.log(this);
    shelf.removeChild(this.parentNode);
}


// library.forEach(i => {
//     const bookDiv = document.createElement("div");
//     if(i.readStatus.toLowerCase() === "not read") {
//         bookDiv.setAttribute("class", "unread-logged-book");
//     } else if(i.readStatus.toLowerCase() === "reading") {
//         bookDiv.setAttribute("class", "reading-logged-book");
//     } else {
//         bookDiv.setAttribute("class", "read-logged-book");
//     }
    
//     const bookInfoDiv = document.createElement("div");
//     bookInfoDiv.setAttribute("class", "book-info");
    
//     const titlePEle = document.createElement("p");
//     titlePEle.setAttribute("class", "logged-title");
//     titlePEle.append(i.title);
    
//     const authorPEle = document.createElement("p");
//     authorPEle.setAttribute("class", "logged-author");
//     authorPEle.append(i.author);
    
//     const pagesPEle = document.createElement("p");
//     pagesPEle.setAttribute("class", "logged-pages");
//     pagesPEle.append(`${i.pages} pages`);
    
//     bookInfoDiv.append(titlePEle, authorPEle, pagesPEle);
    
//     const readStatusDiv = document.createElement("div");
//     readStatusDiv.setAttribute("class", "logged-read-status");
    
//     const notReadButton = document.createElement("button");
//     notReadButton.setAttribute("type", "button");
//     notReadButton.setAttribute("class", "not-read");
//     notReadButton.append("Not Read");
    
//     const readingButton = document.createElement("button");
//     readingButton.setAttribute("type", "button");
//     readingButton.setAttribute("class", "reading");
//     readingButton.append("Reading");
    
//     const readButton = document.createElement("button");
//     readButton.setAttribute("type", "button");
//     readButton.setAttribute("class", "read");
//     readButton.append("Read");
    
//     readStatusDiv.append(notReadButton, readingButton, readButton);
    
//     const deleteBtn = document.createElement("button");
//     deleteBtn.setAttribute("type", "button");
//     deleteBtn.setAttribute("class", "delete-book");
    
//     const trashIcon = document.createElement("i");
//     trashIcon.setAttribute("class", "fas fa-trash-alt");
    
//     deleteBtn.appendChild(trashIcon);
    
//     bookDiv.append(bookInfoDiv, readStatusDiv, deleteBtn);
    
//     shelf.appendChild(bookDiv);
// })







// function Book(t, a, pN, r) {
//     this.title = t;
//     this.author = a;
//     this.pageNumber = pN;
//     this.read = r;
//     this.info = function() {
//         return `The ${this.title} by ${this.author}, ${this.pageNumber} pages, ${this.read} yet`
//     }
// }

// const theHobbit = new Book("Hobbit", "J.R.R. Tolkien", 295, "not read");