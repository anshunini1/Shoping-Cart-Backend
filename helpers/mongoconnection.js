const { error } = require('console')
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME
  })
  .then(() => {
    console.log('mongodb connected.')
  })
  .catch((err) => console.log(err.message))
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db')
  })
  