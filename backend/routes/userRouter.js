const express = require("express");
const JWT_SECRET = require("../config");
const zod = require("zod");
const { User } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require("../authMiddleware")

const userRouter = express.Router()

const signUpSchema = zod.object({
    username: zod.email(),
    password: zod.string().min(6, {error: "Password must be at least 6 characters long"}),
    firstName: zod.string(),
    lastName: zod.string()

})

userRouter.post("/signup", async (req, res) => {
   try {    
        const result = signUpSchema.safeParse(req.body)
        if( !result.success ){
            return res.status(411).json({
                message: result.error.issues[0]?.message || "Invalid Credentials"
            })
        }

        const existingUser = await User.findOne({
            username: req.body.username
        })

        if(existingUser){
            return res.status(411).json({
                message: "Account with this email already exists please Signin"
            })
        }

        const { username, password, firstName, lastName} = req.body;

        const hashedPassword =  bcrypt.hash(password, 10)

        const user = await User.create({
            username: username,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })

        const userId = user._id;

        const token = jwt.sign({
            userId,
        }, JWT_SECRET)

        res.status(200).json({
            message: "User account created successfully",
            token: token
        })
    } catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})


const signInSchema = zod.object({
    username: zod.email(),
    password: zod.string().min(6, {error: "Password must be at least 6 characters long"}),
})

userRouter.post("/signin", async (req, res) => {
    try{    
        const result = signInSchema.safeParse(req.body);

        if(!result.success){
            return res.status(411).json({
                message: result.error.issues[0].message || "Invalid Credentials"
            })
        }

        const { username, password } = req.body

        const user = await User.findOne({
            username: username
        })

        if(!user){
            return res.status(411).json({
                message: "Invalid username or password"
            })
        }

        const isMatch = await bcrypt.compare(
            password, 
            user.password
        )

        if(!isMatch){
            return res.status(411).json({
                message: "Invalid username or password"
            })
        }

        const token = jwt.sign(
            {userId: user._id},
            JWT_SECRET, 
            {expiresIn: "1h"}
        )

        return res.status(200).json({
            message: "SignIn Successful"
        })
    } catch(error){
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

})

const updateBodySchema = zod.object({
    password: zod.string(6, {error: "Password must be atleast 6 characters long"}).optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

userRouter.put("/",authMiddleware, async (req, res) => {
    try {
        const result = updateBodySchema.safeParse(req.body);

        if(!result.success){
            return res.status(411).json({
                message: result.error.issues[1]?.message || "Invalid Credentials"
            })
        }

        const updateData = {... result.data}

        if(updateData.password){
            updateData.password = await bcrypt.hash(updateData.password, 10)
        }

        await User.updateOne(
            { _id: req.userId },
            { $set: updateData } // simply updateData would also work
        )

        return res.status(200).json({
            message: "Updated Successfully"
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

})

userRouter.get("/bulk", authMiddleware, (req, res) => {
    
})

module.exports = {
    userRouter
}