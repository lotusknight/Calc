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
  res.send('Hello from Node.js backend! api');
});

app.post('/calc', (req, res) => {
  const { probability, trials } = req.body;

  // Example calculation (replace with your real logic)
  // Here, we create a geometric distribution as an example
  let distribution = [];
  let accumulatedProbability = 0;
  for (let i = 1; i <= trials; i++) {
    const prob = Math.pow(1 - probability, i - 1) * probability;
    distribution.push(prob);
    accumulatedProbability += prob;
  }

  res.json({
    distribution,
    accumulatedProbability,
  });
});
