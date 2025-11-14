import express from "express"
import { createSignInSchema, createSignUpSchema } from "./types"
import bcrypt from "bcrypt"
import { client } from "@repo/db/client"
import jwt from "jsonwebtoken"

const app = express()

app.post("/signup",async(req,res)=>{

    const paresedData= createSignUpSchema.safeParse(req.body);

    if(!paresedData.success){
        res.status(402).json({
            msg : "failed input validation",
        })
        return 
    }
    const hashedPassword =await bcrypt.hash(paresedData.data.password, 5)
    try{
        const response = await client.user.create({
            data:{
                username : paresedData.data.username,
                email : paresedData.data.email,
                password : hashedPassword
            }
        })
        res.status(200).json({
            id : response.id,
            msg : "user signup succesfully"
        })
    }catch(e){
        res.status(405).json({
            msg : "something went wrong during inserting data into db"
        })
        return 
    }
    
})

app.post("/signin",async(req, res)=>{
    const paresedData = createSignInSchema.safeParse(req.body)
    if(!paresedData.success){
        res.status(411).json({
            msg : "failed input validation"
        })
        return 
    }
    try{

        
        const response = await client.user.findFirst({
            where:{
                email : paresedData.data.email
            }
        })
        if(!response.id){
            res.status(411).json({
                msg : "user doesn't exist"
            })
            return 
        }


        const isCorrectPassword = await bcrypt.compare(paresedData.data.password,response.password)
        if(!isCorrectPassword){
            res.status(403).json({
                msg : "incorrect password"
            })
            return 
        }
        const JWT_SECRET = process.env.JWT_SECRET
        const token =  jwt.sign({
            id : response.id
        },JWT_SECRET!)

        res.status(200).json({
            token : token,
        })
        return 
        
    }catch(e){
        res.status(411).json({
            msg : "something went wrong",
            error : e
        })
    }
})


app.get("/repo",(req,res)=>{
    
})

app.listen(8000,()=>{
    console.log("server is running on port 8000")
})