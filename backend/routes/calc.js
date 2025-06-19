const express = require('express');
const router = express.Router();
const Calculator = require('../utils/Calculator');

router.post('/', (req, res) => {
  const { probability, trials } = req.body;
  const calc = new Calculator(probability, trials);
  const { distribution, accumulatedProbability } = calc.calculateDistribution();

  res.json({
    distribution,
    accumulatedProbability,
  });
});


module.exports = router;