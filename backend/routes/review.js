const express = require("express")
const Review  = require("../src/reviews")

module.exports = (db) => {
    
    const router  = express.Router()
    
    router.post('/review', async (req, res) => {
        try {
            const { userId, bookId, content } = req.body;
            const review = new Review(db);
            await review.add(userId, bookId, content);
            res.json(`{"message": "success"}`);
        } catch (err) {
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    });
    
    router.get('/review', async (req, res) => {
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
    
    router.put('/review', async (req, res) => {
        try {
            const { id, content } = req.body;
            const review = new Review(db);
            await review.findById(id);
            review.setParams(review.id, review.userId, review.bookId, content);
            await review.update();
            res.json(`{"message": "success"}`);
        } catch (err) {
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    });
    
    router.delete('/review', async (req, res) => {
        try {
            const { id } = req.body;
            const review = new Review(db);
            await review.findById(id);
            if (review.id == id) {
                await review.delete();
                res.json(`{"message": "success"}`);
            } else {
                res.status(400).json(`{"error": "bad request: the specified book doesn't exist"}`);
            }
        } catch (err) {
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    });

    return router;
}