def calculate_distribution(probability: float, trials: int):
    distribution = []
    accumulated_probability = 0
    for i in range(1, trials + 1):
        prob = (1 - probability) ** (i - 1) * probability
        distribution.append(prob)
        accumulated_probability += prob
    return distribution, accumulated_probability