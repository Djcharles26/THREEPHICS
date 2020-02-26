const express = require('express');
const app = express();
const http = require('http').Server(app);
const bp = require('body-parser');
const fs = require('fs');


var path = require('path');

app.use(bp.urlencoded());


app.use(bp.json());

app.use('/static', express.static('js'));

app.use('/styles' , express.static('css'));

app.use('/icons' , express.static('assets/icons'));

app.get('/test' , (req,res) => {res.json("msg: Server works!")});

app.get('/app', (req,res) => res.sendFile(path.join(__dirname + "/html/index.html")));

app.post('/scene', (req, res) => {
    fs.writeFile(path.join(dirname + "/assets/files/scene.json"),JSON.stringify (req.body), function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
    res.json({
        works
      })
});

http.listen(3000, ()=>{console.log("Server started in port 3000")});

