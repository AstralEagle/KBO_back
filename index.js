const express = require('express');
const app = express();
const port = 3001; // Vous pouvez choisir n'importe quel port

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
