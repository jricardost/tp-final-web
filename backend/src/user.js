class User {
    
    
    constructor(dbconn){
        this.db = dbconn;
        this.id = null
        this.name = null
        this.email = null
        this.password = null
    }
    
    /* PROPERTIES */
    
    _setAll(id, name, email, password){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
    
    dump(){
        console.log(`[id: ${this.id} name: ${this.name} email: ${this.email} passwd: ${this.password}]`);
    }
    
    /* CREATE */
    
    async add(){
        this.add(this.name, this.email, this.password)
    }
    
    async add(username, email, password){
        let query = `INSERT INTO users (id, name, email, passwd) VALUES (NULL, '${username}', '${email}', '${password}')`;
        return this._query(query);
    }
    
    /* READ */
    
    async findById(id) {
        let query = `SELECT * FROM users WHERE id='${id}'`;
        let result = await this._query(query);
        
        if (result != 'undefined' && result.length > 0) {
            this._setAll(result[0].id, this.name = result[0].name, this.email = result[0].email, this.password = result[0].passwd)
        }
        
        return result;
    }
    
    async findByEmail(email) {
        
        let query = `SELECT * FROM users WHERE email='${email}' LIMIT 1`;
        let result = await this._query(query);
        
        if (result != 'undefined') {
            this._setAll(result[0].id, this.name = result[0].name, this.email = result[0].email, this.password = result[0].passwd)
        }
        
        return result;
    }
    
    /* UPDATE */
    
    update(){
        let query = `UPDATE users SET name = '${this.name}', email = '${this.email}', passwd = '${this.password}' WHERE users.id = ${this.id}`;
        return this._query(query);
    }
    
    /* DELETE */
    
    delete(){
        let query = `DELETE FROM users WHERE users.id = ${this.id}`;
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

module.exports = User;
