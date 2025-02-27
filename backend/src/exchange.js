class Exchange {
    
    constructor(dbconn){
        this.db = dbconn;
        this.id = null
        this.sender = null
        this.senderBook = null
        this.receiver = null
        this.receiverBook = null
        this.status = null
    }
    
    dump(){
        console.log(`id          : ${this.id}`);
        console.log(`sender      : ${this.sender}`);
        console.log(`senderBook  : ${this.senderBook}`);
        console.log(`receiver    : ${this.receiver}`);
        console.log(`receiverBook: ${this.receiverBook}`);
        console.log(`status      : ${this.status}`);
    }
    
    /* PROPERTIES */
    
    _setAll(id, sender, senderBook, receiver, receiverBook, status){
        this.id = id;
        this.sender = sender
        this.senderBook = senderBook
        this.receiver = receiver
        this.receiverBook = receiverBook
        this.status = status
    }
    
    /* CREATE */
    
    async add(){
        this.add(this.sender, this.senderBook, this.receiver, this.receiverBook, this.status)
    }
    
    async add(sender, senderBook, receiver, receiverBook, status){
        let query = `INSERT INTO exchange (id, sender, senderBook, receiver, receiverBook, status) VALUES (NULL, '${sender}', '${senderBook}', '${receiver}', '${receiverBook}','${status}')`;
        console.log(query)
        return this._query(query);
    }
    
    /* UPDATE */
    
    update(){
        let query = `UPDATE exchanges SET status = '${this.status}`;
        console.log(query)
        return this._query(query);
    }
    
    /* DELETE */
    
    delete(){
        let query = `DELETE FROM exchange WHERE exchange.id = ${this.id}`;
        console.log(query)
        return this._query(query);
    }
    
    /* READ */
    
    async findById(id) {
        let query = `SELECT * FROM exchange WHERE id='${id}'`;
        console.log(query)

        let result = await this._query(query);
        console.log(result);      

        return result;
    }
    
    async findBySender(id) {
        let query = `SELECT * FROM exchange WHERE sender='${id}'`;
        console.log(query)

        let result = await this._query(query);
        console.log(result);

        return result;
    }
    
    async findByReceiver(id) {
        let query = `SELECT * FROM exchange WHERE receiver='${id}'`;
        console.log(query)

        let result = await this._query(query);
        console.log(result);

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

module.exports = Exchange;
