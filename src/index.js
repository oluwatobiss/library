import "./style.css";
import '@fortawesome/fontawesome-free/js/all'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDocs, deleteDoc, updateDoc, query, where } from "firebase/firestore";

const bookInfoForm = document.getElementById("book-info-form");
const bookAddedInfo = document.querySelectorAll(".book-added-info");
const addReadStateBtns = document.querySelectorAll(".add-read-state");
const addBookBtn = document.getElementById("add-book");
const numberOfBooks = document.getElementById("numb-of-bks");
const searchForm = document.getElementById("search");
const deleteAllBtn = document.getElementById("delete-all");
const shelf = document.getElementById("shelf");
const bookReadStatusBtns = document.getElementsByClassName("status-btn");
const delBookBtn = document.getElementsByClassName("delete-book");
const deleteAllModalBg = document.getElementById("del-all-modal-bg");
const closeModalBtn = document.getElementById("close-modal");
const deleteAllConfirmationText = document.getElementById("del-all-conf-text");
const deleteAllOkayBtn = document.getElementById("delete-all-okay");
const cancelDelAllReqBtn = document.getElementById("cancel-del-all-request");
const title = bookAddedInfo[0];
const author = bookAddedInfo[1];
const pages = bookAddedInfo[2];
let allTitlesArr = [];
let rStatus = "";

const firebaseConfig = {
    apiKey: "AIzaSyDcJQK8RtiC3ZU10aBw-RqfnIIJ6X5DaV8",
    authDomain: "library-app-262e5.firebaseapp.com",
    projectId: "library-app-262e5",
    storageBucket: "library-app-262e5.appspot.com",
    messagingSenderId: "463063201004",
    appId: "1:463063201004:web:ec5d5964fa4ac8995961c9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addEventListener("load", getBooksFromFirestore);
addReadStateBtns.forEach(i => i.addEventListener("click", logReadStatus));
addBookBtn.addEventListener("click", createAndStoreBookInfoObj);
searchForm.addEventListener("keyup", searchForBook);
deleteAllBtn.addEventListener("click", confirmDelAllRequest);
window.addEventListener("click", closeDelAllModalBox);
deleteAllOkayBtn.addEventListener("click", deleteAllBooks);

async function getBooksFromFirestore() {
    let allBooksTitleObj = null;
    const querySnapshot = await getDocs(collection(db, "allBooksTitle"));
    querySnapshot.forEach((doc) => { allBooksTitleObj = doc.data(); });

    if (allBooksTitleObj) {
        const turnJSONArrToJSArr = JSON.parse(allBooksTitleObj.allTitlesArr);
        allTitlesArr = [...turnJSONArrToJSArr];
        turnJSONArrToJSArr.reverse();

        let books = [];
        const booksSnapshot = await getDocs(collection(db, "books"));
        booksSnapshot.forEach((doc) => { books.push({ ...doc.data() }); });

        for (const val of turnJSONArrToJSArr) {
            books.forEach(async (book) => {
                if (val === book.title) {
                    createAndAddBookToLib(book);
                }
            })
        }
    }
}

async function createAndStoreBookInfoObj() {    
    const bookInfoObj = {
        title: title.value,
        author: author.value,
        pages: pages.value,
        rStatus: rStatus,
    };

    for (const prop in bookInfoObj) {
        if (bookInfoObj[prop] === "") {
            alert("Please provide all the book's details");
            return;
        }
    }

    // Store the book's title to this document's allTitlesArr array:
    allTitlesArr.unshift(bookInfoObj.title);

    // Replace Firestore's allTitlesArr array with this document's own:
    try {
        let currAllTitlesArrID = null;
        const querySnapshot = await getDocs(collection(db, "allBooksTitle"));
        
        querySnapshot.forEach((doc) => { currAllTitlesArrID = doc.id; });
        if (currAllTitlesArrID) { await deleteDoc(doc(db, "allBooksTitle", currAllTitlesArrID)); }

        await addDoc(collection(db, "allBooksTitle"), { allTitlesArr: JSON.stringify(allTitlesArr) });
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    // Add the bookInfoObj to the Firestore database:
    try {
        await addDoc(collection(db, "books"), bookInfoObj);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    createAndAddBookToLib(bookInfoObj);
}

function logReadStatus() {
    rStatus = this.innerText.toLowerCase();

    switch (rStatus) {
        case "not read":
            removeReadingStyle();
            removeReadStyle();
            this.style.backgroundColor = "#a6d608";
            this.style.fontWeight = "bold";
            break;
        case "reading":
            removeNotReadStyle();
            removeReadStyle();
            this.style.backgroundColor = "#9955bb";
            this.style.fontWeight = "bold";
            break;
        case "read":
            removeNotReadStyle();
            removeReadingStyle();
            this.style.backgroundColor = "#006400";
            this.style.fontWeight = "bold";
    }

    function removeNotReadStyle() {
        addReadStateBtns[0].style.backgroundColor = "";
        addReadStateBtns[0].style.fontWeight = "";
    }
    function removeReadingStyle() {
        addReadStateBtns[1].style.backgroundColor = "";
        addReadStateBtns[1].style.fontWeight = "";
    }
    function removeReadStyle() {
        addReadStateBtns[2].style.backgroundColor = "";
        addReadStateBtns[2].style.fontWeight = "";
    }
}

function createAndAddBookToLib(bookInfoObject) {
    const bookDiv = document.createElement("div");

    (bookInfoObject.rStatus === "not read") ? 
    bookDiv.setAttribute("class", "unread-logged-book")
    : (bookInfoObject.rStatus === "reading") ?
    bookDiv.setAttribute("class", "reading-logged-book")
    : bookDiv.setAttribute("class", "read-logged-book");
    
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

    switch (bookInfoObject.rStatus) {
        case "not read":
            notReadButton.style.backgroundColor = "#a6d608";
            notReadButton.style.fontWeight = "bold";
            break;
        case "reading":
            readingButton.style.backgroundColor = "#9955bb";
            readingButton.style.fontWeight = "bold";
            break;
        case "read":
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
    shelf.prepend(bookDiv);
    updateOtherFacilities();
}

function updateOtherFacilities() {
    for (let i = 0; i < bookReadStatusBtns.length; i++) {
        bookReadStatusBtns[i].addEventListener("click", showReadStatus)
    }
    for (let i = 0; i < delBookBtn.length; i++) {
        delBookBtn[i].addEventListener("click", removeBookDiv)
    }

    numberOfBooks.innerText = shelf.children.length;

    rStatus = "";
    bookInfoForm.reset();
    addReadStateBtns.forEach(i => {
        i.style.backgroundColor = "";
        i.style.fontWeight = "";
    });
}

async function showReadStatus(clickedBtn) {
    const clickedReadState = this.innerText.toLowerCase();
    const bookReadStateBtns = this.parentNode.children;
    const bookBackground = this.parentNode.parentNode;
    const bookInfoDiv = clickedBtn.composedPath()[2].children[0];
    const bookTitle = bookInfoDiv.firstElementChild.innerText;
    const bookSnapshot = await getDocs(query(collection(db, "books"), where("title", "==", bookTitle)));
    let bookInfoObjFromFirestore = null;

    bookSnapshot.forEach((doc) => { bookInfoObjFromFirestore = { ...doc.data(), id: doc.id }; });

    switch (clickedReadState) {
        case "not read":
            changeBookStatToNotRead();
            removeReadingStyle();
            removeReadStyle();
            bookBackground.style.backgroundColor = "#a6d608";
            this.style.backgroundColor = "#a6d608";
            this.style.fontWeight = "bold";
            break;
        case "reading":
            changeBookStatToReading();
            removeNotReadStyle();
            removeReadStyle();
            bookBackground.style.backgroundColor = "#9955bb";
            this.style.backgroundColor = "#9955bb";
            this.style.fontWeight = "bold";
            break;
        case "read":
            changeBookStatToRead();
            removeNotReadStyle();
            removeReadingStyle();
            bookBackground.style.backgroundColor = "#006400";
            this.style.backgroundColor = "#006400";
            this.style.fontWeight = "bold";
    }

    async function changeBookStatToNotRead() {
        if (bookInfoObjFromFirestore.rStatus.match(/(reading)|(read)/)) {
            await updateDoc(doc(db, "books", bookInfoObjFromFirestore.id), { rStatus: "not read" });
        }
    }
    async function changeBookStatToReading() {
        if (bookInfoObjFromFirestore.rStatus.match(/(not read)|(read)/)) {
            await updateDoc(doc(db, "books", bookInfoObjFromFirestore.id), { rStatus: "reading" });
        }
    }
    async function changeBookStatToRead() {
        if (bookInfoObjFromFirestore.rStatus.match(/(not read)|(reading)/)) {
            await updateDoc(doc(db, "books", bookInfoObjFromFirestore.id), { rStatus: "read" });
        }
    }

    function removeNotReadStyle() {
        bookReadStateBtns[0].style.backgroundColor = "";
        bookReadStateBtns[0].style.fontWeight = "";
    }
    function removeReadingStyle() {
        bookReadStateBtns[1].style.backgroundColor = "";
        bookReadStateBtns[1].style.fontWeight = "";
    }
    function removeReadStyle() {
        bookReadStateBtns[2].style.backgroundColor = "";
        bookReadStateBtns[2].style.fontWeight = "";
    }
}

async function removeBookDiv() {
    // Remove the book's title from the allTitlesArr array in this document:
    const bookTitle = this.parentNode.firstElementChild.firstElementChild.innerText;
    const indexOfBookInArr = allTitlesArr.indexOf(bookTitle);
    allTitlesArr.splice(indexOfBookInArr, 1);
    
    // Remove the book's title from the allBooksTitle array in the Firestore database:
    let allBooksTitleObjFromFirestore = null;
    const allBooksTitleSnapshot = await getDocs(collection(db, "allBooksTitle"));

    allBooksTitleSnapshot.forEach((doc) => {
        allBooksTitleObjFromFirestore = { ...doc.data(), id: doc.id };
    });
    
    const turnJSONArrToJSArr = JSON.parse(allBooksTitleObjFromFirestore.allTitlesArr);
    const indexOfParsedBookArr = turnJSONArrToJSArr.indexOf(bookTitle);
    turnJSONArrToJSArr.splice(indexOfParsedBookArr, 1);

    await updateDoc(doc(db, "allBooksTitle", allBooksTitleObjFromFirestore.id), { allTitlesArr: JSON.stringify(turnJSONArrToJSArr) });
    
    // Remove the book's data from the Firestore database:
    let bookID = null;
    const bookTitleSnapshot = await getDocs(query(collection(db, "books"), where("title", "==", bookTitle)));
    bookTitleSnapshot.forEach((doc) => { bookID = doc.id; });
    await deleteDoc(doc(db, "books", bookID));

    // Remove the book's data from the library:
    shelf.removeChild(this.parentNode);
    numberOfBooks.innerText = shelf.children.length;
}

function searchForBook() {
    const searchValue = searchForm.value.toLowerCase();
    const books = shelf.children;
    for (let i = 0; i < books.length; i++) {
        const titlePEle = books[i].querySelector(".logged-title");
        // If the book's title matches the search value display the book -- else, hide it:
        (titlePEle.innerText.toLowerCase().indexOf(searchValue) > -1) ?
        books[i].style.display = ""
        : books[i].style.display = "none";
    }
}

function confirmDelAllRequest() {
    if (shelf.children.length === 0) return;

    (shelf.children.length === 1) ?
    deleteAllConfirmationText.innerHTML = `Are you sure you want to <strong>permanently delete this book</strong> from your Library?`
    : deleteAllConfirmationText.innerHTML = `Are you sure you want to <strong>permanently delete all ${shelf.children.length} books</strong> from your Library?`;

    deleteAllModalBg.style.display = "block";
}

function closeDelAllModalBox(objClicked) {
    if (objClicked.target === deleteAllModalBg || objClicked.target === closeModalBtn || objClicked.target === cancelDelAllReqBtn) {
        deleteAllModalBg.style.display = "none";
    }
}

async function deleteAllBooks() {
    let bookObjID = null;
    const booksSnapshot = await getDocs(collection(db, "books"));
    booksSnapshot.forEach(async (book) => {
        bookObjID = book.id;
        await deleteDoc(doc(db, "books", bookObjID));
    });

    let allBooksTitleObjID = null;
    const allBooksTitleSnapshot = await getDocs(collection(db, "allBooksTitle"));
    allBooksTitleSnapshot.forEach(async (obj) => {
        allBooksTitleObjID = obj.id;
        await deleteDoc(doc(db, "allBooksTitle", allBooksTitleObjID));
    });

    allTitlesArr = [];
    while (shelf.firstChild) shelf.firstChild.remove();
    numberOfBooks.innerText = shelf.children.length;
    deleteAllModalBg.style.display = "none";
}