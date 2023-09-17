const express = require("express")
const route = express()

route.get('/',(req,res)=>{
    res.render('index')
})
route.get('/meet',(req,res)=>[
    res.render("app")
])
route.get('/app',(req,res)=>{
    res.render('chat')
})
module.exports = route