/*
    POST:
        body = { id, sender, senderBook, receiver, receiverBook, status }

    GET:
        empty : return all exchanges
        id    : return exchange by id
        ANY(sender, senderBook, receiver, receiverBook)

    PUT:
        body = { id, sender, senderBook, receiver, receiverBook, status }

    DELETE:
        body = { id }
*/


const express   = require("express")
const Exchange  = require("../src/exchange")

module.exports = (db) => {
    
    const router  = express.Router()
    
    router.post('/', async (req, res) => {
        try {
            const { id, sender, senderBook, receiver, receiverBook, status } = req.body;
            const exchange = new Exchange(db);
            
            if (sender && senderBook && receiver && receiverBook){
                exchange.add(sender, senderBook, receiver, receiverBook, (status ? status : "aguardando"));
                
                res.json(`{"message": "success"}`)
                return;
            } 
            
            res.status(400).json(`{"error": "bad request"}`)
            return;
            
        } catch (err) {
            res.status(500).json(`{"error": "internal server error"}`)
            console.log(err)
            return
        }
    });
    
    router.get('/', async (req, res) => {
        try {
            const exchange = new Exchange(db)
            let result = []
            
            const { id, sender, senderBook, receiver, receiverBook } = req.query
            
            if (id) {
                const reviewById = await exchange.findById(id);
                result.push(reviewById)
                
            } else {   
                if (sender) {
                    const resultBySender = await exchange.findBySender(sender)
                    result.push(resultBySender)
                }
                
                if (senderBook) {
                    const resultBySenderBook = await exchange.findBySenderBook(senderBook)
                    result.push(resultBySenderBook)
                }
                
                if (receiver) {
                    const resultByReceiver = await exchange.findByReceiver(receiver)
                    result.push(resultByReceiver)
                }
                
                if (receiverBook) {
                    const resultByReceiverBook = await exchange.findByReceiverBook(receiverBook)
                    result.push(resultByReceiverBook)
                }
            }
            
            if (result.length == 0){
                result = await exchange.findAll();
            }
            
            res.json(result)
            return
            
        } catch (err){
            console.log(err)
            res.status(500).json(`{"error": "internal server error"}`)
            return
        }
    });
    
    router.put('/', async (req, res) => {
        try {
            const { id, sender, senderBook, receiver, receiverBook, status } = req.body;
            const exchange = new Exchange(db);

            exchange.findById(id)

            if (!exchange.id){
                res.status(400).json(`{"error": "Bad request"}`)
                return
            }
            
            if (sender) exchange.sender = sender;
            if (senderBook) exchange.senderBook = senderBook;
            if (receiver) exchange.receiver = receiver;
            if (receiverBook) exchange.receiverBook = receiverBook;
            if (status) exchange.status = status;
            await exchange.update();
            
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
            const exchange = new Exchange(db);
            await exchange.findById(id);
            
            if (exchange.id == id) {
                await exchange.delete();
                res.json(`{"message": "success"}`);
                return
            } else {
                res.status(400).json(`{"error": "bad request"}`);
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