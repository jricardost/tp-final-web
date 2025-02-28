const express   = require('express')
const mysql     = require("mysql2")

const Book      = require("./src/book")
const Exchange  = require("./src/exchange")
const Review    = require("./src/reviews")
const User      = require("./src/user")

const app = express()
var port = 3000

if (process.argv.length > 2){
    port = process.argv[2]
}

app.use(express.json())

/* DATABASE */

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

db.connect(err => {
    if (err) {
        console.log("Falha na conexão")
        throw err
    }
    console.log("Conectado!")
})


/* ROTAS */

app.listen(port, () => {
    console.log(`\ntp-avaliado-web executando na porta ${port}`)
})


app.post('/login', async (req, res) => {
    try {
        
        const { email, password } = req.body
        const user = new User(db)
        const data = await user.findByEmail(email) 
        
        console.log(`${email} ${password}`)
        
        if (password == null || user.password != password){
            res.status(401).send("Unauthorized")
            return
        }
        
        console.log(`data: ${JSON.stringify(data)}`)
        res.send(`{"id":"${user.id}"}`)
        return
        
    } catch (error) {
        res.status(500).send("Database error")
        console.log(error)
        return
    }
})

app.post('/register', (req, res) => {
    try {
        const { username, email, password } = req.body

        console.log(req.body)

        let user = new User(db)

        user.findByEmail(email)

        if (user.email == null){
            user.add(username, email, password)
        }

        res.send()

    } catch (err){

    }
})


/* BOOK */

// create 
app.post('/books', async (req, res) => {
    
    try {
        const {ownerId, title, author, edition, preservation } = req.query
        const book = new Book(db)
        let query = await book.add(ownerId, title, author, edition, preservation)
        
        res.send("OK")
        return
        
    } catch(err){
        
        console.log(err)
        res.status(500)
        res.send("Error")
        return
    }
    
})

app.get('/books', async (req, res) => {
    
    try {
        const book = new Book(db)
        let result
        

        if (!req.query || Object.keys(req.query).length === 0){
            console.log("FIND_ALL")
            result = await book.findAll();
        } else {
            console.log("FIND_FILTERED")

            const { userId,  filter } = req.query
            
            if (filter == "my") {
                result = await book.findOwnedBy(userId)
            }
            
            if (filter == "available"){
                result = await book.findAvailableTo(userId)
            }
        }
        console.log(result)
        res.send(JSON.stringify(result))
        return
        
    } catch (err){
        console.log(err)
        return
    }
})

app.put('/books', async (req, res) => {
    try {
        const {bookId, ownerId, title, author, edition, preservation } = req.query
        
        const book = new Book(db)
        await book.findById(bookId)
        book.setParams(book.id, ownerId, title, author, edition, preservation) //cannot change book id!
        let query = await book.update()
        res.send("OK")
        return
        
    } catch(err){
        
        console.log(err)
        res.status(500)
        res.send("Error")
        return
    }
})

app.delete('/books', async (req, res) => {
    try {
        const book = new Book(db)
        let result
        

        if (!req.query || Object.keys(req.query).length === 0){
            res.status(400)
            res.send()
        } else {

            const { bookId } = req.query
            
            await book.findById(bookId)

            if (book.id == bookId){
                book.delete()
                res.send("Deleted!")
            } else {
                res.status(401)
                res.send('Bad Request!')
            }
        }
        
        return
        
    } catch (err){
        console.log(err)
        return
    }
})

app.post('/exchange', async (req, res) => {
    try {
        const { sender, senderBook, receiver, receiverBook, status } = req.query;
        const exchange = new Exchange(db);
        await exchange.add(sender, senderBook, receiver, receiverBook, status);
        res.send("Exchange Created");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.get('/exchange', async (req, res) => {
    try {
        const exchange = new Exchange(db);
        const result = await exchange.findAll();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.put('/exchange', async (req, res) => {
    try {
        const { id, sender, senderBook, receiver, receiverBook, status } = req.query;
        const exchange = new Exchange(db);
        await exchange.findById(id);
        exchange.setParams(id, sender, senderBook, receiver, receiverBook, status);
        await exchange.update();
        res.send("Exchange Updated");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.delete('/exchange', async (req, res) => {
    try {
        const { id } = req.query;
        const exchange = new Exchange(db);
        await exchange.findById(id);
        if (exchange.id === id) {
            await exchange.delete();
            res.send("Exchange Deleted");
        } else {
            res.status(400).send("Bad Request");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

/* REVIEW */

app.post('/review', async (req, res) => {
    try {
        const { userId, bookId, content } = req.query;
        const review = new Review(db);
        await review.add(userId, bookId, content);
        res.send();
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.get('/review', async (req, res) => {
    try {
        const review = new Review(db);
        const result = await review.findAll();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.put('/review', async (req, res) => {
    try {
        const { id, content } = req.query;
        const review = new Review(db);
        await review.findById(id);
        review.setParams(review.id, review.userId, review.bookId, content);
        await review.update();
        res.send("Review Updated");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.delete('/review', async (req, res) => {
    try {
        const { id } = req.query;
        const review = new Review(db);
        await review.findById(id);
        if (review.id === id) {
            await review.delete();
            res.send("Review Deleted");
        } else {
            res.status(400).send("Bad Request");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

/*
app.post('/', (req, res) => {
    })
*/
