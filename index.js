const express = require('express');
const app = express();


const port = 5000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('build'));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*")
  next();
});

app.get('/', (req, res) => {
  res.send('hello');
})

app.listen(port, () => console.log(`Listening on port ${port}`));
