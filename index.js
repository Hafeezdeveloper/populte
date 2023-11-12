
require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
app.use(express.json())
app.use(cors()) //its a middle wear
app.use(express.static(__dirname));

const userRouter = require("./Routers/User")
const categoryRouter = require("./Routers/adminCategory")
const categoryListRouter = require("./Routers/adminCatList")
const AdminUser = require("./Routers/User/AdminUserCreate")
const PromoAdmin = require("./Routers/PromoPages/PromoAdmin")
const CondAdmin = require("./Routers/Condition/ConditionAdmin")
const RoleRouter = require("./Routers/Role/role")
const QuizzRouter = require("./Routers/leveltest/quizz_test")
const routerStripe = require("./Routers/StripeIntent/Stripe")
const { userModel } = require("./Model/UserSchema")


app.post("/ref/log" , async (req,res) =>{
    
    try {
        let result = await userModel.create({
            name:req.body.name,
            email:req.body.email,
            image:req.body.image
        })
        if(result){
        res.send(result)                
    }else{
        res.send("result Not Found")                
        }

    } catch (error) {
        console.log(error)
    }
})    

let messageSchema = mongoose.Schema({
    send:{ type : String},
    userid:{
       type : mongoose.Schema.Types.ObjectId , ref:"User"
    },
    gender:{ type : String},
    number:{ type : Number}
})
let message =  mongoose.model("msg" , messageSchema)

app.post("/ref/log/msg/:id" , async (req,res) =>{
    try {
        let result = await message.create({
            send:req.body.send,
            userid: req.params.id,
            gender:req.body.gender,
            number:req.body.number
        })
        if(result){
            console.log(result)
        res.send(result)                
    }else{
        res.send("result Not Found")                
        }

    } catch (error) {
        console.log(error)
    }
})    
//populate method
app.get("/ref/log/msg/:id" , async (req,res) =>{
    try {
        let result = await message.find({_id:req.params.id }).populate({path:"userid",select:["image"]})
        if(result){
            console.log(result)
        res.send(result)                
    }else{
        res.send("result Not Found")                
        }

    } catch (error) {
        console.log(error)
    }
})    


app.use("/api/user",userRouter)
app.use("/api/admin",categoryRouter)
app.use("/api/admin",categoryListRouter)
app.use("/api/admin",AdminUser)
app.use("/api/admin",PromoAdmin)
app.use("/api/admin",CondAdmin)
app.use("/api/admin",RoleRouter)
app.use("/api/admin",QuizzRouter)
app.use("/api/admin",routerStripe)

mongoose.connect(process.env.MONGO_URI)
.then( (succ) =>{
    app.listen(process.env.PORT, () =>{
        console.log("server is running sucessfully")  
    })
})
.catch( (err) =>{
    console.log(err)
})