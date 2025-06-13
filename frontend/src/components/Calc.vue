<template>
    <div class="calc-container">
        <h2>Geometric Distribution Calculator</h2>
        <form @submit.prevent="calculate">
            <div>
                <label for="probability">Probability (p):</label>
                <input
                    id="probability"
                    v-model.number="probability"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    required
                />
            </div>
            <div>
                <label for="trials">Times of Test (n):</label>
                <input
                    id="trials"
                    v-model.number="trials"
                    type="number"
                    min="1"
                    required
                />
            </div>
            <button type="submit">Calculate</button>
        </form>

        <div v-if="result">
            <h3>Accumulated Probability: {{ result.accumulatedProbability }}</h3>
            <canvas ref="chart"></canvas>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
    name: 'Calc',
    setup() {
        const probability = ref(0.5);
        const trials = ref(5);
        const result = ref(null);
        const chartRef = ref(null);
        let chartInstance = null;

        const calculate = async () => {
            try {
                const response = await fetch('/calc', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        probability: probability.value,
                        trials: trials.value,
                    }),
                });
                const data = await response.json();
                result.value = data;
            } catch (error) {
                alert('Calculation failed.');
            }
        };

        watch(result, () => {
            if (result.value && result.value.distribution) {
                if (chartInstance) chartInstance.destroy();
                const labels = result.value.distribution.map((_, i) => i + 1);
                const dataSet = result.value.distribution;
                chartInstance = new Chart(chartRef.value, {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [
                            {
                                label: 'Probability',
                                data: dataSet,
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            title: { display: true, text: 'Geometric Distribution' },
                        },
                        scales: {
                            x: { title: { display: true, text: 'Trial' } },
                            y: { title: { display: true, text: 'Probability' }, beginAtZero: true },
                        },
                    },
                });
            }
        });

        return {
            probability,
            trials,
            result,
            chart: chartRef,
            calculate,
        };
    },
};
</script>

<style scoped>
.calc-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #1a1a1a;
}
form > div {
    margin-bottom: 1rem;
}
label {
    display: block;
    margin-bottom: 0.25rem;
}
input[type="number"] {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
}
button {
    padding: 0.5rem 1rem;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:hover {
    background: #1565c0;
}
canvas {
    margin-top: 1rem;
    width: 100% !important;
    height: 300px !important;
}
</style>