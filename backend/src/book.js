class Book {
    
    constructor(dbconn){
        this.db = dbconn;
        this.id = null
        this.owner = null
        this.title = null
        this.author = null
        this.edition = null
        this.condition = null
    }
    
    dump(){
        console.log(`id       : ${this.id}`);
        console.log(`owner    : ${this.owner}`);
        console.log(`title    : ${this.title}`);
        console.log(`author   : ${this.author}`);
        console.log(`edition  : ${this.edition}`);
        console.log(`condition: ${this.condition}`);
    }
    
    /* PROPERTIES */
    
    _setAll(id, ownerId, title, author, edition, preservation){
        this.id = id;
        this.owner = ownerId
        this.title = title
        this.author = author
        this.edition = edition
        this.condition = preservation
    }
    
    /* CREATE */
    
    async add(){
        this.add(this.owner, this.title, this.author, this.edition, this.condition)
    }
    
    async add(owner, title, author, edition, codition){
        let query = `INSERT INTO books (id, ownerId, title, author, edition, preservation) VALUES (NULL, '${owner}', '${title}', '${author}', '${edition}','${codition}')`;
        console.log(query)
        return this._query(query);
    }
    
    /* UPDATE */
    
    update(){
        let query = `UPDATE books SET ownerId = '${this.owner}', title = '${this.title}', author = '${this.author}', edition = '${this.edition}', preservation = '${this.condition}' WHERE books.id = ${this.id}`;
        console.log(query)
        return this._query(query);
    }
    
    /* DELETE */
    
    delete(){
        let query = `DELETE FROM books WHERE books.id = ${this.id}`;
        console.log(query)
        return this._query(query);
    }
    
    /* READ */
    
    //Get a specific book by id
    async findById(id) {
        let query = `SELECT * FROM books WHERE id='${id}'`;
        console.log(query)
        let result = await this._query(query);
        
        if (result != 'undefined' && result.length > 0) {
            setAll(result[0].id, this.owner = result[0].ownerId, this.title = result[0].title, this.author = result[0].author, this.edition = result[0].edition. this.condition = result[0].preservation)
        }
        
        return result;
    }
    
    //Get a specific book by title
    async findByTitle(title) {
        let query = `SELECT * FROM books WHERE title='${title}'`;
        console.log(query)
        let result = await this._query(query);
        
        if (result != 'undefined' && result.length > 0) {
            setAll(result[0].id, this.owner = result[0].ownerId, this.title = result[0].title, this.author = result[0].author, this.edition = result[0].edition. this.condition = result[0].preservation)
        }
        
        return result;
    }
    
    //Get books now owned by a user
    async findAvailableTo(id){
        let query = `SELECT * FROM books WHERE NOT ownerId='${id}'`;
        console.log(query)
        let result = await this._query(query);
        
        
        
        if (result != 'undefined' && result.length > 0) {
            console.log(result)
        }
        
        return result;
    }
    
    async findOwnedBy(id){
        let query = `SELECT * FROM books WHERE ownerId='${id}'`;
        console.log(query)
        let result = await this._query(query);
        
        if (result != 'undefined' && result.length > 0) {
            console.log(result)
        }
        
        return result;
    }
    
    _query(query){
        return new Promise((resolve, reject) => {
            this.db.query(query, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = Book;
