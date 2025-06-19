class Calculator {
  constructor(probability, trials) {
    this.probability = probability;
    this.trials = trials;
  }

  calculateDistribution() {
    let distribution = [];
    let accumulatedProbability = 0;
    for (let i = 1; i <= this.trials; i++) {
      const prob = Math.pow(1 - this.probability, i - 1) * this.probability;
      distribution.push(prob);
      accumulatedProbability += prob;
    }
    return { distribution, accumulatedProbability };
  }
}

module.exports = Calculator;