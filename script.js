let library = [
    {
        bookTitle: "Hobbit",
        author: "J.R.R. Tolkien",
        pages: 295,
        readStatus: "Not read"
    },
    {
        bookTitle: "To Kill a Mockingbird",
        author: "Harper Lee",
        pages: 56,
        readStatus: "Read"
    },
    {
        bookTitle: "Harry Potter and the Philosopher’s Stone",
        author: "J.K. Rowling",
        pages: 100,
        readStatus: "Not read"
    }
];

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

function addBookToLibrary(t, a, pN, r) {
    library.push({
        bookTitle: t,
        author: a,
        pages: pN,
        readStatus: r
    });
}