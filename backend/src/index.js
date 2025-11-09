const express = require('express');
const app = express();
app.use(express.json());

const userRoutes = require('./src/routes/userRoutes');
const prescriptionRoutes = require('./src/routes/prescriptionRoutes');

app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

const port = 3001;

app.get('/', (req, res) => {
  res.send('O servidor Backend está funcionando!');
});

app.listen(port, () => {
  console.log(`Exemplo de servidor ouvindo http://localhost:${port}`);
});