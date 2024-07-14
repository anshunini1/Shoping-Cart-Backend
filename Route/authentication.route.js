const express= require("express")
const route= express.Router()
const Authcontroller= require("../controller/auth.controller")
route.post('/register',Authcontroller.RegisterUser)
route.post('/login',Authcontroller.LoginUserCheck)
route.post('/logout',Authcontroller.LogoutUser)
route.post('/refresh',Authcontroller.Refreshtoken)
module.exports= route