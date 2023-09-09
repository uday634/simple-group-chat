const express = require("express");
const path = require("path");
const fs = require('fs')
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
    fs.readFile('message.txt',(err, data)=>{
        if(err){
            console.error(err);
        }
        res.send(
            `${data}<form action="/" onSubmit="document.getElementById('username').value=localStorage.getItem('username')"  method="POST">
                <input id="message" type="text" name="message">
                <input id="username" type="hidden" name="username">
                <button type="submit">send</button>
            </form>`
          );
    })
  
});

app.post("/", (req, res, next) => {
  console.log(req.body.message);
  console.log(req.body.username); // Corrected to req.body.username

  fs.writeFile('message.txt', `${req.body.username}:${req.body.message}`,{flag:'a'}, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500); // Respond with an error status
    } else {
      console.log('Message saved');
      res.redirect('/');
    }
  });
});

app.get("/login", (req, res) => {
  res.send(`
    <form onsubmit="localStorage.setItem('username', document.getElementById('username').value)" action="/message" method="POST">
      <input id="username" type="text" name="username"> <!-- Corrected input name here -->
      <button type="submit">add</button>
    </form>
  `);
});

app.use('/message', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
