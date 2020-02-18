const express = require('express');
const app = express();
const http = require('http').Server(app);



var path = require('path');

app.use('/static', express.static('js'));

app.use('/styles' , express.static('css'));


app.get('/test' , (req,res) => {res.json("msg: Server works!")});

app.get('/app', (req,res) => res.sendFile(path.join(__dirname + "/html/index.html")));

http.listen(3000, ()=>{console.log("Server started in port 3000")});

