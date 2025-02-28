class Exchange {
    constructor(dbconn) {
        this.db = dbconn;
        this.id = null;
        this.sender = null;
        this.senderBook = null;
        this.receiver = null;
        this.receiverBook = null;
        this.status = null;
    }
    
    setParams(id, sender, senderBook, receiver, receiverBook, status) {
        this.id = id;
        this.sender = sender;
        this.senderBook = senderBook;
        this.receiver = receiver;
        this.receiverBook = receiverBook;
        this.status = status;
    }
    
    async add(sender, senderBook, receiver, receiverBook, status) {
        let query = `INSERT INTO exchanges (id, sender, senderBook, receiver, receiverBook, status) 
                     VALUES (NULL, '${sender}', '${senderBook}', '${receiver}', '${receiverBook}', '${status}')`;
        console.log(query);
        return await this._query(query);
    }
    
    async update() {
        let query = `UPDATE exchanges SET sender='${this.sender}', senderBook='${this.senderBook}', 
                     receiver='${this.receiver}', receiverBook='${this.receiverBook}', status='${this.status}' 
                     WHERE id=${this.id}`;
        console.log(query);
        return this._query(query);
    }
    
    async delete() {
        let query = `DELETE FROM exchanges WHERE id=${this.id}`;
        console.log(query);
        return this._query(query);
    }
    
    async findById(id) {
        let query = `SELECT * FROM exchanges WHERE id='${id}'`;
        console.log(query);
        let result = await this._query(query);
        if (result && result.length > 0) {
            this.setParams(result[0].id, result[0].sender, result[0].senderBook, result[0].receiver, result[0].receiverBook, result[0].status);
        }
        return result;
    }
    
    async findAll() {
        let query = `SELECT * FROM exchanges`;
        console.log(query);
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

module.exports = Exchange