// Basic Express server setup
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api', (req, res) => {
  res.send('Connected to the API!');
});

const calcRoutes = require('./routes/calc');
app.use('/calc', calcRoutes);