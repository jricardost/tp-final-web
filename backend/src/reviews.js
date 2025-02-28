class Review {
    constructor(dbconn) {
        this.db = dbconn;
        this.id = null;
        this.userId = null;
        this.bookId = null;
        this.content = null;
    }
    
    setParams(id, userId, bookId, content) {
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.content = content;
    }
    
    async add(userId, bookId, content) {
        let query = `INSERT INTO reviews (id, userId, bookId, content) VALUES (NULL, '${userId}', '${bookId}', '${content}')`;
        return await this._query(query);
    }
    
    async update() {
        let query = `UPDATE reviews SET userId='${this.userId}', bookId='${this.bookId}', content='${this.content}' WHERE id=${this.id}`;
        return this._query(query);
    }
    
    async delete() {
        let query = `DELETE FROM reviews WHERE id=${this.id}`;
        return this._query(query);
    }
    
    async findById(id) {
        let query = `SELECT * FROM reviews WHERE id='${id}'`;
        let result = await this._query(query);
        if (result && result.length > 0) {
            this.setParams(result[0].id, result[0].userId, result[0].bookId, result[0].content);
        }
        return result;
    }

    async findByUser(id){
        let query = `SELECT * FROM reviews WHERE userId='${id}'`;
        let result = await this._query(query);
        if (result && result.length > 0) {
            this.setParams(result[0].id, result[0].userId, result[0].bookId, result[0].content);
        }
        return result;
    }

    async findByBook(id){
        let query = `SELECT * FROM reviews WHERE bookId='${id}'`;
        let result = await this._query(query);
        if (result && result.length > 0) {
            this.setParams(result[0].id, result[0].userId, result[0].bookId, result[0].content);
        }
        return result;
    }
    
    async findAll() {
        let query = `SELECT * FROM reviews`;
        return await this._query(query);
    }
    
    _query(query) {
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
