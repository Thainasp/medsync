const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('O servidor Backend está funcionando!');
});

app.listen(port, () => {
  console.log(`Exemplo de servidor ouvindo http://localhost:${port}`);
});