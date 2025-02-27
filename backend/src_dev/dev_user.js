const mysql     = require("mysql2")
const User      = require("../src/user")

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
    
    let user = new User(db)
    
    switch(process.argv[2]){
        case 'insert': {
            if (process.argv.length != 6) return error("Missing arguments");
            let res = await user.add(process.argv[3], process.argv[4], process.argv[5])
            console.log(res);
            break;
        }
        
        case 'find-id': {
            if (process.argv.length != 4) return error("Missing arguments");
            let res = await user.findById(process.argv[3])
            user.dump();
            break;
        }
        
        case 'find-email': {
            if (process.argv.length != 4) return error("Missing arguments");
            let res = await user.findByEmail(process.argv[3])
            user.dump();
            break;
        }
        
        case 'update': {
            if (process.argv.length != 7) return error("Missing arguments (id, name, email, password)");
            let res = await user.findById(process.argv[3])

            user.dump()

            user.name = process.argv[4];
            user.email = process.argv[5]
            user.password = process.argv[6]

            user.dump();

            user.update();
            
            break;
            
        }

        case 'delete': {
            if (process.argv.length != 4) return error("Missing arguments (id)");
            let res = await user.findById(process.argv[3])
            user.delete();
            break;
        }
    }

    
    process.exit(0)
}

main()