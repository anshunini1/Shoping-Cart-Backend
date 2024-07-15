const { urlencoded } = require("body-parser")
const express = require("express")
const createError = require("http-errors")
require('dotenv').config()
const cors = require('cors');
const { extend } = require("lodash")
const { verifyToken } = require('./helpers/jwttoken_generator')
const AuthenticationRout= require("./Route/authentication.route");
const { object } = require("joi");
const {decryptText} = require("./helpers/crypto")
const app=express()
require("./helpers/mongoconnection")
require("./helpers/redis_start")
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000'] // Whitelist the domains you want to allow
};
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/ping', async (req, res, next) => {
  res.send({message: 'Hello from server.'})
})
app.use('/*', async (req, res, next) => {
  if(req.body &&  req.body.hasOwnProperty("M") !== object )
   {
    const decryptedText=  decryptText(req.body.M)
    req.body=JSON.parse(decryptedText)
    next()
   } 
  else
  {
    console.log("AAAAASSSS")
    next()
  }
 
})
app.get('/fetchconfig', async (req, res)=>{
  res.send({"message":"Server is ready to serve","keys":process.env.DECREPTED_KEY})
})
app.get('/get', verifyToken, async (req, res, next) => {
  res.send('Hello from express.')
})
app.use("/auth",AuthenticationRout)
app.use(async (req, res, next) => {
    next(createError.NotFound())
  })
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    })
  })
const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log("SERVER IS RUNNING",PORT)
})