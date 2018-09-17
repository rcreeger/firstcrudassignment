const express = require('express');
const app = express();
const port = process.env.port || 8000;
const fs = require('fs');
const bodyParser = ('body-parser');



app.post('/create/:name/:email/:state', function(req, res) {
  let storage = fs.readFileSync(__dirname + '/storage.json', 'utf-8');
  let userData = JSON.parse(storage);
  let newUser = {
    name: req.params.name,
    email: req.params.email,
    state: req.params.state
  };
  userData.push(newUser);
  fs.writeFileSync(__dirname + '/storage.json', JSON.stringify(userData));
  res.send(userData);
})

let storage = fs.readFileSync(__dirname + '/storage.json', 'utf-8');
app.get('/users', function(req, res) {
  res.send(JSON.parse(storage));
})

app.get("/users/:name", function(req, res){
  let userData = JSON.parse(storage);
  for(let i=0; i<userData.length; i++){
    let user = userData[i];
    if(user.name === req.params.name){
      res.json(user);
      return;
    }
  }
  res.sendStatus(400);
});

app.patch('/users/:name', function(req, res) {
  let userData = JSON.parse(storage);
  let updatedUserData = {
    name: req.params.name,
    email: req.params.email,
    state: req.params.state
  }
  for(let i=0; i<userData.length; i++){
  let user = userData[i];
  if(user.name === req.params.name){
    userData[userData.indexOf(user)] = updatedUserData;
    fs.writeFileSync('./storage.json', JSON.stringify(userData));
    res.json(userData);
    return;
  }
}
res.sendStatus(400);
})


app.delete('/delete/:name', function(req, res) {
  let storage = fs.readFileSync('./storage.json', 'utf-8');
  let userData = JSON.parse(storage);
  let deletedData = userData.filter((user) => {
    return user.name !== req.params.name;
  });
  fs.writeFileSync('./storage.json', JSON.stringify(deletedData));
  res.send('User has been deleted')
})


app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log('Listening on port', port);
});
