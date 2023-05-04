// Получение всех пользователей
async function getBooks() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/books", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const books = await response.json();
        let rows = document.querySelector("tbody"); 
        books.forEach(book => {
            // добавляем полученные элементы в таблицу
            rows.append(row(book));
        });
    }
}
// Получение одного пользователя
async function getBook(id) {
    const response = await fetch("/books/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const book = await response.json();
        const form = document.forms["bookForm"];
        form.elements["id"].value = book._id;
        form.elements["name"].value = book.name;
        form.elements["year"].value = book.year;
        form.elements["author"].value = book.author;
    }
}
// Добавление пользователя
async function createBook(bookName, bookYear, bookAuthor) {

    const response = await fetch("/books", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: bookName,
            year: parseInt(bookYear, 10),
            author: bookAuthor
        })
    });
    if (response.ok === true) {
        const book = await response.json();
        reset();
        document.querySelector("tbody").append(row(book));
    }
}
// Изменение пользователя
async function editBook(bookId, bookName, bookYear, bookAuthor) {
    const response = await fetch("/books", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: bookId,
            name: bookName,
            year: parseInt(bookYear, 10),
            author: bookAuthor
        })
    });
    if (response.ok === true) {
        const book = await response.json();
        reset();
        document.querySelector(`tr[data-rowid='${book._id}']`).replaceWith(row(book));
    }
}
// Удаление пользователя
async function deleteBook(id) {
    const response = await fetch("/books/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const book = await response.json();
        document.querySelector(`tr[data-rowid='${book._id}']`).remove();
    }
}

// сброс формы
function reset() {
    const form = document.forms["bookForm"];
    form.reset();
    form.elements["id"].value = 0;
}
// создание строки для таблицы
function row(book) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", book._id);

    const idTd = document.createElement("td");
    idTd.append(book._id);
    tr.append(idTd);

    const nameTd = document.createElement("td");
    nameTd.append(book.name);
    tr.append(nameTd);

    const yearTd = document.createElement("td");
    yearTd.append(book.year);
    tr.append(yearTd);

    const authorTd = document.createElement("td");
    authorTd.append(book.age);
    tr.append(authorTd);
       
    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", book._id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Изменить");
    editLink.addEventListener("click", e => {

        e.preventDefault();
        getUser(book._id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", book._id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Удалить");
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        deleteUser(book._id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}
// сброс значений формы
document.getElementById("reset").addEventListener("click", e => {

    e.preventDefault();
    reset();
})

// отправка формы
document.forms["bookForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["bookForm"];
    const id = form.elements["id"].value;
    const name = form.elements["name"].value;
    const year = form.elements["year"].value;
    const author = form.elements["author"].value;
    if (id == 0)
        createBook(name, year, author);
    else
        editBook(id, name, year, author);
});

// загрузка пользователей
getBooks();