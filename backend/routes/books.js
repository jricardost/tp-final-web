const express = require("express")
const Book    = require("../src/book")

module.exports = (db) => {
    
    const router  = express.Router()
    
    router.post('/books', async (req, res) => {
        
        try {
            const {ownerId, title, author, edition, preservation } = req.body
            const book = new Book(db)
            let query = await book.add(ownerId, title, author, edition, preservation)
            
            res.json(`{"message": "success"}`)
            return
            
        } catch(err){
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
        
    })
    
    router.get('/books', async (req, res) => {
        
        try {
            const book = new Book(db)
            let result
            
            
            if (!req.query || Object.keys(req.query).length === 0){
                result = await book.findAll();
            } else {
                
                const { userId,  filter } = req.query
                
                if (filter == "my") {
                    result = await book.findOwnedBy(userId)
                }
                
                if (filter == "available"){
                    result = await book.findAvailableTo(userId)
                }
            }
            res.json(result)
            return
            
        } catch (err){
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    })
    
    router.put('/books', async (req, res) => {
        try {
            const {bookId, ownerId, title, author, edition, preservation } = req.body
            
            const book = new Book(db)
            await book.findById(bookId)
            book.setParams(book.id, ownerId, title, author, edition, preservation) //cannot change book id!
            let query = await book.update()
            res.json(`{"message": "success"}`)
            return
            
        } catch(err){
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    })  
   
    router.delete('/books', async (req, res) => {
        try {
            const book = new Book(db)
            let result
            
            
            if (!req.body || Object.keys(req.body).length === 0){
                res.status(400).json(`{"error": "bad request"}`)
            } else {
                
                const { bookId } = req.body
                
                await book.findById(bookId)
                
                if (book.id == bookId){
                    book.delete()
                    res.json(`{"message": "success"}`)
                } else {
                    res.status(400).json(`{"error": "bad request"}`)
                }
            }
            
            return
            
        } catch (err){
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    })

    return router;
}