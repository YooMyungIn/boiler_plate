const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')

URL = 'mongodb+srv://auddls3269:auddlsd1@cluster0.bmtgl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose
.connect(URL,{})
.then(()=>console.log('MongoDB Connected!!'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})