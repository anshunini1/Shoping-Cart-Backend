const { urlencoded } = require("body-parser")
const express = require("express")
const createError = require("http-errors")
const { extend } = require("lodash")
const { verifyToken } = require('./helpers/jwttoken_generator')
const AuthenticationRout= require("./Route/authentication.route")
require('dotenv').config()
const app=express()
require("./helpers/mongoconnection")
require("./helpers/redis_start")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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