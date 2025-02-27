class Review {

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
    
    async add(userId, bookId, content){
        let query = `INSERT INTO reviews (id, userId, bookId, content VALUES (NULL, '${userId}', '${bookId}', '${content}')`;
        console.log(query)
        return this._query(query);
    }

    /* READ */
    
    async findById(id) {
        let query = `SELECT * FROM reviews WHERE id='${id}'`;
        console.log(query)

        let result = await this._query(query);
        console.log(result)

        return result;
    }

    /* UPDATE */

    update(){
        let query = `UPDATE reviews SET content = '${this.content}'`;
        console.log(query)
        return this._query(query);
    }

    /* DELETE */

    delete(){
        let query = `DELETE FROM reviews WHERE reviews.id = ${this.id}`;
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

module.exports = Review;
