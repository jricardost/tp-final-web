/*
    POST:
        body = { ownerId, title, author, edition, preservation }

    GET:
        empty                   : return all books
        ?userId=1                  : return books owned by user 1
        ?userId=1&filter=available : return books available to user 1

    PUT:
        body = { bookId, ownerId, title, author, edition, preservation }  !!! bookId cannot be changed!

    DELETE:
        body = { id }
*/

const express = require("express")
const Book    = require("../src/book")

module.exports = (db) => {
    
    const router  = express.Router()
    
    router.post('/', async (req, res) => {
        
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
    
    router.get('/', async (req, res) => {
        
        try {
            const book = new Book(db)
            let result
            
            
            if (!req.query || Object.keys(req.query).length === 0){
                result = await book.findAll();
            } else {
                
                const { userId,  filter } = req.query
                
                if (!filter) {
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
    
    router.put('/', async (req, res) => {
        try {
            const {id, ownerId, title, author, edition, preservation } = req.body
            
            let book = new Book(db)
            await book.findById(id)

            if (book.id == null){
                res.status(400).json(`{"error": "bad request"}`) 
                return   
            }

            if (ownerId) book.owner = ownerId
            if (title) book.title = title
            if (author) book.author = author
            if (edition) book.edition = edition
            if (preservation) book.condition = preservation

            let query = await book.update()

            res.json(`{"message": "success"}`)
            return
            
        } catch(err){
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    })  
   
    router.delete('/', async (req, res) => {
        try {
            const book = new Book(db)
            let result
            
            
            if (!req.body || Object.keys(req.body).length === 0){
                res.status(400).json(`{"error": "bad request"}`)
                return
            } else {
                
                const { bookId } = req.body
                
                await book.findById(bookId)
                
                if (book.id == bookId){
                    book.delete()
                    res.json(`{"message": "success"}`)
                    return
                } else {
                    res.status(400).json(`{"error": "bad request"}`)
                    return
                }
            }
            
        } catch (err){
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    })

    return router;
}