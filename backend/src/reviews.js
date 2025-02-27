class Book {



    constructor(dbconn){
        this.db = dbconn;
        this.id = null
        this.userId = null
        this.bookId = null
        this.content = null
    }

    dump(){
        console.log(`id       : ${this.id}`);
        console.log(`userId   : ${this.userId}`);
        console.log(`bookId   : ${this.bookId}`);
        console.log(`content  : ${this.content}`);
    }

    /* PROPERTIES */

    _setAll(id, user, userId){

    }

    /* CREATE */

    async add(){
       // this.add(this.owner, this.title, this.author, this.edition, this.condition)
    }
    
    async add(userId, boodId, content){
        let query = `INSERT INTO reviews (id, userId, bookId, content VALUES (NULL, '${userId}', '${bookId}', '${content}')`;
        console.log(query)
        return this._query(query);
    }

    /* READ */
    
    async findById(id) {
        let query = `SELECT * FROM reviews WHERE id='${id}'`;
        console.log(query)
        let result = await this._query(query);

        if (result != 'undefined' && result.length > 0) {
            this.id = result[0].id;
            this.owner = result[0].ownerId
            this.title = result[0].title
            this.author = result[0].author
            this.edition = result[0].edition
            this.condition = result[0].preservation
        }

        return result;
    }
    
    async findByAuthorTitle(author, title) {
        let query = `SELECT * FROM books WHERE author='${author}' OR title='${title}'`;
        console.log(query)
        let result = await this._query(query);

        if (result != 'undefined' && result.length > 0) {
            this.id = result[0].id;
            this.owner = result[0].ownerId
            this.title = result[0].title
            this.author = result[0].author
            this.edition = result[0].edition
            this.condition = result[0].preservation
        }

        return result;
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
