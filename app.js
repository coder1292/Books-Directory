const mongoose = require("mongoose");
const express = require('express');
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
const authRouter = require('./authRouter')

const bookScheme = new Schema({name: String, year: Number, author: String}, {versionKey: false});
const Book = mongoose.model("Book", bookScheme);

app.use(express.static(__dirname + "/public"));
app.use("/auth", authRouter);

async function main() {
 
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/usersdb");
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
    }
    catch(err) {
        return console.log(err);
    }
}

app.get("/books", async (req, res)=>{
    // получаем всех пользователей
    const books = await Book.find({});
    res.send(books);
});
  
app.get("/books/:id", async(req, res)=>{
          
    const id = req.params.id;
    // получаем одного пользователя по id
    const book = await Book.findById(id);
    if(book) res.send(book);
    else res.sendStatus(404);
});
     
app.post("/books", jsonParser, async (req, res) =>{
         
    if(!req.body) return res.sendStatus(400);
         
    const bookName = req.body.name;
    const bookYear = req.body.year;
    const bookAuthor = req.body.author;
    const book = new Book({name: bookName, year: bookYear, author: bookAuthor});
    // сохраняем в бд
    await book.save();
    res.send(book);
});
      
app.delete("/books/:id", async(req, res)=>{
          
    const id = req.params.id;
    // удаляем по id 
    const book = await Book.findByIdAndDelete(id);
    if(book) res.send(book);
    else res.sendStatus(404);
});
     
app.put("/books", jsonParser, async (req, res)=>{
          
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const bookName = req.body.name;
    const bookYear = req.body.year;
    const bookAuthor = req.body.author;
    const newBook = {year: bookYear, name: bookName, author: bookAuthor};
     // обновляем данные пользователя по id
    const book = await Book.findOneAndUpdate({_id: id}, newBook, {new: true}); 
    if(book) res.send(book);
    else res.sendStatus(404);
});
 
main();
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async() => {
      
    await mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
});