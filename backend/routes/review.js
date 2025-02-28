/*
    POST:
        body = { userId, bookId, content }

    GET:
        empty  : return all reviews
        id     : return review by id
        ANY(userId, bookId)

    PUT:
        body = { bookId, ownerId, title, author, edition, preservation }  !!! bookId cannot be changed!

    DELETE:
        body = { id }
*/
const express = require("express")
const Review  = require("../src/reviews")

module.exports = (db) => {
    
    const router  = express.Router()
    
    router.post('/', async (req, res) => {
        try {
            const { userId, bookId, content } = req.body;
            const review = new Review(db);
            await review.add(userId, bookId, content);
            res.json(`{"message": "success"}`);
            return
        } catch (err) {
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    });
    
    router.get('/', async (req, res) => {
        try {
            const review = new Review(db)
            let result = []
            
            const { id, userId, bookId } = req.query
            
            if (id) {
                const reviewById = await review.findById(id);
                result.push(reviewById)
                
            } else {   
                if (userId) {
                    const resultByUser = await review.findByUser(userId)
                    result.push(resultByUser)
                }
                
                if (bookId) {
                    const resultByBook = await review.findByBook(bookId)
                    result.push(resultByBook)
                }
            }
            
            if (result.length == 0){
                result = await review.findAll();
            }
            
            res.json(result)
            return
            
        } catch (err){
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    });
    
    router.put('/', async (req, res) => {
        try {
            const { id, content } = req.body;
            const review = new Review(db);
            await review.findById(id);

            if (review.id == null){
                res.json(`{"error": "bad request"}`);
                return
            }

            if (content) review.content = content

            await review.update();

            res.json(`{"message": "success"}`);
            return
        } catch (err) {
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    });
    
    router.delete('/', async (req, res) => {
        try {
            const { id } = req.body;
            const review = new Review(db);
            await review.findById(id);
            if (review.id == id) {
                await review.delete();
                res.json(`{"message": "success"}`);
                return
            } else {
                res.status(400).json(`{"error": "bad request: the specified book doesn't exist"}`);
                return
            }
        } catch (err) {
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    });

    return router;
}