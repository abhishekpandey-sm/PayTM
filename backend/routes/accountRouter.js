const express = require("express");
const { authMiddleware } = require("../authMiddleware");
const { Account } = require("../db");
const  mongoose  = require("mongoose");

const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
    try{   
        const account = await Account.findOne({
            userId: req.userId
        })

        res.json({
            balance: account.balance
        })
    } catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

})


accountRouter.post("/transfer", authMiddleware, async (req, res) => {

    const { amount , to }  = req.body;

    if (typeof(amount) !== "number" || 
        !Number.isFinite(amount) ||
        amount <= 0
    ){
        return res.status(400).json({
            message: "Invalid Amount"
        })
    }

    if (typeof to !== "string" ||
        !mongoose.Types.ObjectId.isValid(to)
    ){
        return res.status(400).json({
            message: "Invalid Reciepent"
        })
    }

    if (to === String(req.userId)){
        return res.status(400).json({
            message: "Cannot transfer money to yourself"
        })
    }

    const session = await mongoose.startSession();

    try{
        await session.withTransaction(async() => {
            const toAccount = await Account.findOne({
                userId: to
            }).session(session)

            if(!toAccount){
                const error = new Error("Invalid Reciepent");
                error.statusCode = 400;
                throw error;
            }

            const debit = await Account.updateOne(
                { userId: req.userId,
                  balance: {$gte: amount} },
                { $inc: {balance: -amount} },
                {session}
            )

            if(debit.matchedCount !== 1){
                const error = new Error("Insufficient balance or sender account not found")
                error.statusCode = 400;
                throw error
            }

            const credit = await Account.updateOne(
                {userId: to,},
                {$inc: {balance: amount} }, 
                {session}
            )

            if(credit.matchedCount !== 1){
                throw new Error("Recipient account update failed")
            }

        })

        return res.json({
            message: "Transfer successful"
        });

    } catch(error){
        console.error(error)

        return res.status(error.statusCode || 500).json({
            message: error.statusCode 
            ? error.message
            : "Internal Server Error"
        })
    } finally{
        await session.endSession();
    }
})



module.exports =  accountRouter;
