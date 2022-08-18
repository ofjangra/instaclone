const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')


const cors = require('cors')


dotenv.config({path: "./config.env"})


const dbURI = process.env.DBURI




mongoose.connect(dbURI)


mongoose.connection.on('connected', () =>{
    console.log("connected to db")
})

mongoose.connection.on('error', (error) =>{
    console.log('failed to connect to db', error)
})


require('./models/users')
require('./models/post')


const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors({
    origin: "*",
    methods:["GET","POST","PUT","DELETE"]
    }))
    
app.use(require('./routes/auth'))
app.use(require('./routes/post'))



app.listen(port,() =>{
    console.log("server started at port: ", port)
})
