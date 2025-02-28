const express        = require('express')
const mysql          = require("mysql2")
const cors           = require("cors")
const User           = require("./src/user")

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

const bookRoutes     = require("./routes/books")(db)
const reviewRoutes   = require("./routes/review")(db)
const exchangeRoutes = require("./routes/exchange")(db)

const app = express()

app.use(cors())
app.use(express.json())
app.use("/books", bookRoutes)
app.use("/review", reviewRoutes)
app.use("/exchange", exchangeRoutes)

const port = process.argv.length > 2 ? Number(process.argv[2]) || 3000 : 3000;

/* AUTHENTICATION */

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
        res.json(`{"id": "${user.id}"}`)
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
        return
        
    } catch (err){
        res.status(500).json(`{"error": "internal server error"}`)
        console.log(err)
        return
    }
})