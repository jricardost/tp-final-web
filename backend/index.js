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

app.post('/', (req, res) => {
})

app.post('/login', async (req, res) => {
    try {
        
        const { email, password } = req.query
        const user = new User(db)
        const data = await user.findByEmail(email) 
        
        console.log(`${email} ${password}`)
        
        if (password == null || user.password != password){
            res.status(401).send("Unauthorized")
            return
        }
        
        console.log(`data: ${JSON.stringify(data)}`)
        return
        
    } catch (error) {
        res.status(500).send("Database error")
        console.log(error)
        return
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



/*
app.post('/', (req, res) => {
    })
*/
