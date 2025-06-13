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
                    min="10"
                    step="10"
                    required
                />
            </div>
            <button type="submit">Calculate</button>
        </form>

        <div v-if="result">
            <h3>Accumulated Probability: {{ (result.accumulatedProbability * 100).toFixed(2) }}%</h3>
            <canvas ref="chart"></canvas>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

export default {
    name: 'Calc',
    setup() {
        const probability = ref(0.02);
        const trials = ref(50);
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

        watch(result, async () => {
            if (result.value && result.value.distribution) {
                await nextTick(); // Wait for DOM update
                if (chartInstance) chartInstance.destroy();
                const labels = result.value.distribution.map((_, i) => i + 1);
                const dataSet = result.value.distribution;

                // Calculate accumulated probability array
                let accumulated = [];
                let sum = 0;
                for (let p of dataSet) {
                    sum += p;
                    accumulated.push(sum);
                }

                chartInstance = new Chart(chartRef.value, {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [
                            {
                                label: 'Probability',
                                data: dataSet,
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                yAxisID: 'y',
                                type: 'bar',
                            },
                            {
                                label: 'Accumulated Probability',
                                data: accumulated,
                                borderColor: '#ff9800',
                                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                                fill: false,
                                yAxisID: 'y1',
                                type: 'line',
                                tension: 0.2,
                                pointRadius: 3,
                                borderWidth: 2,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                            title: { display: true, text: 'Geometric Distribution' },
                        },
                        scales: {
                            x: { title: { display: true, text: 'Trial' }, 
                                min: 1,
                                max: trials.value,
                            },
                            y: {
                                title: { display: true, text: 'Probability' },
                                beginAtZero: true,
                                position: 'left',
                            },
                            y1: {
                                title: { display: true, text: 'Accumulated Probability' },
                                beginAtZero: true,
                                min: 0,
                                max: 1,
                                position: 'right',
                                grid: { drawOnChartArea: false },
                            },
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
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #2d2d2d;
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
    font-size: 1.0rem;
    box-sizing: border-box;
    background: #ddd;
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