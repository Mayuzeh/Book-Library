class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToLibrary(book));
    }

    static addBookToLibrary(book) {
        const library = document.querySelector("#book-library");

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        library.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector(".alert").remove(), 2000);
    }

    static clearFields() {
      document.querySelector("#title").value = ""; 
      document.querySelector("#author").value = ""; 
      document.querySelector("#isbn").value = ""; 
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }
}



document.addEventListener("DOMContentLoaded", UI.displayBooks);

document.querySelector("#book-form").addEventListener("submit", function (e) {

    e.preventDefault();

        const title = document.querySelector("#title").value;
        const author = document.querySelector("#author").value;
        const isbn = document.querySelector("#isbn").value;

        if(title === "" || author === "" || isbn === "") {
            UI.showAlert("Please fill in all the required fields", "danger");
        } else {
            const book = new Book (title, author, isbn);

            UI.addBookToLibrary(book);

            Store.addBook(book);

            UI.showAlert("Book Successfully Added", "success");

            UI.clearFields();
        }
        
    });


document.querySelector("#book-library").addEventListener("click", function(e) {

        UI.deleteBook(e.target);

        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

        UI.showAlert("Book Successfully Removed", "success");
});