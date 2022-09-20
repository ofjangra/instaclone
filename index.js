const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')


const cors = require('cors')


dotenv.config({path: "./config.env"})

const app = express()

app.use(express.json())
app.use(cors({
    origin: "*"
    }))


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




    
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/profile'))
app.use(require("./routes/follows"))

const port = process.env.PORT || 5000

  app.use(express.static("dist"))
  
  app.get("*", (req, res) =>{
     res.sendFile(path.resolve(__dirname, "dist", "index.html"))
  })

app.listen(port,() =>{
    console.log("server started at port: ", port)
})
6
