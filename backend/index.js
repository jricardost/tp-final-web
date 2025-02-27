const express   = require('express')
const mysql     = require("mysql2")
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

/* WAREHOUSE */

app.post('/login', async (req, res) => {
    try {
        const { email, passwd } = req.query
        const user = new User(db)
        const data = await user.findByEmail(email) 

        console.log(`data: ${JSON.stringify(data)}`) // This will now log the correct value

        if (data.length > 0) {
            res.send(data)
        } else {
            res.status(400).send("NOT FOUND")
        }
    } catch (error) {
        res.status(500).send("Database error")
    }
})

/*
app.post('/', (req, res) => {
    })
*/
