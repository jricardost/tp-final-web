const express   = require('express')
const mysql     = require("mysql2")
const cors      = require("cors")

const Book      = require("./src/book")
const Exchange  = require("./src/exchange")
const Review    = require("./src/reviews")
const User      = require("./src/user")

const app = express()
var port = 3000

if (process.argv.length > 2){
    port = process.argv[2]
}

app.use(cors())
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
        if (password == null || user.password != password){
            res.status(401).json(`{"message": "unauthorized"}`)
            return
        }
        res.json(`{"id":"${user.id}"}`)
        return
        
    } catch (err) {
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
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
            res.json(`{"message": "success"}`)
            return
        }
        
        res.json(`{"error": "user already registered"}`)
        
    } catch (err){
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
})


/* BOOK */

// create 
app.post('/books', async (req, res) => {
    
    try {
        const {ownerId, title, author, edition, preservation } = req.body
        const book = new Book(db)
        let query = await book.add(ownerId, title, author, edition, preservation)
        
        res.json(`{"message": "success"}`)
        return
        
    } catch(err){
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
    
})

app.get('/books', async (req, res) => {
    
    try {
        const book = new Book(db)
        let result
        
        
        if (!req.query || Object.keys(req.query).length === 0){
            result = await book.findAll();
        } else {
            
            const { userId,  filter } = req.query
            
            if (filter == "my") {
                result = await book.findOwnedBy(userId)
            }
            
            if (filter == "available"){
                result = await book.findAvailableTo(userId)
            }
        }
        res.json(result)
        return
        
    } catch (err){
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
})

app.put('/books', async (req, res) => {
    try {
        const {bookId, ownerId, title, author, edition, preservation } = req.body
        
        const book = new Book(db)
        await book.findById(bookId)
        book.setParams(book.id, ownerId, title, author, edition, preservation) //cannot change book id!
        let query = await book.update()
        res.json(`{"message": "success"}`)
        return
        
    } catch(err){
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
})

app.delete('/books', async (req, res) => {
    try {
        const book = new Book(db)
        let result
        
        
        if (!req.body || Object.keys(req.body).length === 0){
            res.status(400).json(`{"error": "bad request"}`)
        } else {
            
            const { bookId } = req.body
            
            await book.findById(bookId)
            
            if (book.id == bookId){
                book.delete()
                res.json(`{"message": "success"}`)
            } else {
                res.status(400).json(`{"error": "bad request"}`)
            }
        }
        
        return
        
    } catch (err){
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
})

/* EXCHANGE */
app.post('/exchange', async (req, res) => {
    try {
        const { id, sender, senderBook, receiver, receiverBook, status } = req.body;
        const exchange = new Exchange(db);

        if (sender && senderBook && receiver && receiverBook){
            exchange.add(sender, senderBook, receiver, receiverBook, (status ? status : "aguardando"));

            res.json(`{"message": "success"}`)
            return;
        } 

        res.status(400).json(`{"error": "bad request"}`)
        return;
        
    } catch (err) {
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
});

app.get('/exchange', async (req, res) => {
    try {
        const exchange = new Exchange(db)
        let result = []
        
        const { id, sender, senderBook, receiver, receiverBook } = req.query
        
        if (id) {
            const reviewById = await exchange.findById(id);
            result.push(reviewById)

        } else {   
            if (sender) {
                const resultBySender = await exchange.findBySender(sender)
                result.push(resultBySender)
            }

            if (senderBook) {
                const resultBySenderBook = await exchange.findBySenderBook(senderBook)
                result.push(resultBySenderBook)
            }

            if (receiver) {
                const resultByReceiver = await exchange.findByReceiver(receiver)
                result.push(resultByReceiver)
            }

            if (receiverBook) {
                const resultByReceiverBook = await exchange.findByReceiverBook(receiverBook)
                result.push(resultByReceiverBook)
            }
        }

        if (result.length == 0){
            result = await exchange.findAll();
        }

        res.json(result)
        return
        
    } catch (err){
        console.log(err)
        res.status(500).json(`{"error": "internal server error"}`)
        return
    }
});

app.put('/exchange', async (req, res) => {
    try {
        const { id, sender, senderBook, receiver, receiverBook, status } = req.body;
        const exchange = new Exchange(db);
        await exchange.findById(id);

        if (id){
            res.status(400).json(`{"error": "Bad request"}`)
            return
        }

        if (sender) exchange.sender = sender;
        if (senderBook) exchange.senderBook = senderBook;
        if (receiver) exchange.receiver = receiver;
        if (receiverBook) exchange.receiverBook = receiverBook;
        if (status) exchange.status = status;
        await exchange.update();

        res.json(`{"message": "success"}`);

    } catch (err) {
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
});

app.delete('/exchange', async (req, res) => {
    try {
        const { id } = req.body;
        const exchange = new Exchange(db);
        await exchange.findById(id);

        if (exchange.id == id) {
            await exchange.delete();
            res.json(`{"message": "success"}`);
        } else {
            res.status(400).json(`{"error": "bad request"}`);
        }

        return

    } catch (err) {
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
});

/* REVIEW */

app.post('/review', async (req, res) => {
    try {
        const { userId, bookId, content } = req.body;
        const review = new Review(db);
        await review.add(userId, bookId, content);
        res.json(`{"message": "success"}`);
    } catch (err) {
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
});

app.get('/review', async (req, res) => {
    try {
        const review = new Review(db)
        let result = []
        
        const { id, userId, bookId } = req.query
        
        if (id) {
            const reviewById = await review.findById(id);
            result.push(reviewById)

        } else {   
            if (userId) {
                const resultByUser = await review.findByUser(userId)
                result.push(resultByUser)
            }
            
            if (bookId) {
                const resultByBook = await review.findByBook(bookId)
                result.push(resultByBook)
            }
        }

        if (result.length == 0){
            result = await review.findAll();
        }

        res.json(result)
        return
        
    } catch (err){
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
});

app.put('/review', async (req, res) => {
    try {
        const { id, content } = req.body;
        const review = new Review(db);
        await review.findById(id);
        review.setParams(review.id, review.userId, review.bookId, content);
        await review.update();
        res.json(`{"message": "success"}`);
    } catch (err) {
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
});

app.delete('/review', async (req, res) => {
    try {
        const { id } = req.body;
        const review = new Review(db);
        await review.findById(id);
        if (review.id == id) {
            await review.delete();
            res.json(`{"message": "success"}`);
        } else {
            res.status(400).json(`{"error": "bad request: the specified book doesn't exist"}`);
        }
    } catch (err) {
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
});

/*
app.post('/', (req, res) => {
    })
*/
