const mysql     = require("mysql2")
const Book      = require("../src/book")

var port = 3000

if (process.argv.length > 2){
    port = process.argv[2]
}

/* DATABASE */

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

function error(message){
    console.log(message)
    process.exit(1)
}


async function main(){

    // for (const item in process.argv){
    //     console.log(`[${item}] ${process.argv[item]}`)
    // }
    
    db.connect(err => {
        if (err) {
            console.log("Falha na conexão com o banco de dados")
            process.exit(1)
        }
    })
    
    let book = new Book(db)
    
    switch(process.argv[2]){
        case 'insert': {
            let res = await book.add(1, 'Livro 1', 'Autor 1', '1ª Edição', 'Novo')
            console.log(res);
            break;
        }
        
        case 'find-id': {
            if (process.argv.length != 4) return error("Missing arguments");
            let res = await book.findById(process.argv[3])
            book.dump();
            break;
        }
        
        case 'find-author': {
            let res = await book.findByAuthorTitle("Autor 1", "Livro 1")
            book.dump();
            break;
        }
        
        case 'update': {
            let res = await book.findById(process.argv[3])
            book.dump()
            book.title = "This is another title"
            book.update();
            break;
            
        }

        case 'delete': {
            if (process.argv.length != 4) return error("Missing arguments (id)");
            let res = await book.findById(process.argv[3])
            book.delete();
            break;
        }
    }

    
    process.exit(0)
}

main()