import z from "zod";

export const createSignUpSchema = z.object({
    username : z.string().min(4,{message : "username must have atleast 4 character"}).max(40,{message : "max length is less than 40"}),
    email : z.email(),
    password : z.string().min(8,{message : "password should have atleast 4 character"}).max(40,{message : "max length is less than 40"}),
})

export const createSignInSchema = z.object({
    email : z.string().min(4,{message : "username must have atleat 4 character"}).max(40,{message : "max length is less than 40"}),
    password : z.string().min(8,{message : "password should have atleast 4 character"}).max(40,{message : "max length is less than 40"}),
})  