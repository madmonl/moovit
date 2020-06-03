const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const { name, email, password } = req.body.details;
  const details = JSON.stringify({ name, email, password });
  const filename = `registration_${new Date()}_${Date.now()}`;
  await writeFile(filename, details);
  res.send('Thanks for your time!');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));