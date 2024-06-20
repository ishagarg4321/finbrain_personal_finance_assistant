// // index.js
const { LMStudioClient } = require("@lmstudio/sdk");
// async function main() {
//   // Create a client to connect to LM Studio, then load a model
//   const client = new LMStudioClient();
//   const model = await client.llm.load("TheBloke/phi-2-GGUF/phi-2.Q4_K_S.gguf");
//   // Predict!
//   const prediction = model.respond([
//     { role: "system", content: "You are a helpful AI financial assistant and adviser. please advice for inverstement in equity" },
//     { role: "user", content: "i age is 22 and  salary is 70000 expense is 56000 saving 14000 .advice me for 1 month." },
//   ]);
//   for await (const text of prediction) {
//     process.stdout.write(text);
//   }
// }
const axios = require('axios');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Function to get AI advice
async function getAIAdvice(age, salary, expense, saving) {
  const res = await axios.post("http://localhost:1234/v1/chat/completions", {
    model: "TheBloke/phi-2-GGUF/phi-2.Q4_K_S.gguf:5",
    messages: [
      { role: "system", content: "You are a helpful AI financial assistant and adviser. please advice for inverstement in equity" },
      {
        role: "user",
        content: `i age is 22 and  salary is ${salary} expense is ${expense} saving ${saving} .advice me for 1 month`,
      },
    ],
  });
  const advice = res.data?.choices?.[0]?.message?.content;
  return advice;
}

// Function to show advice and generate graph
async function showAdviceAndGraph(age, salary, expense, saving) {
  const advice = await getAIAdvice(age, salary, expense, saving);
  console.log(advice); // Display the AI advice

  // Generate the graph using chartjs-node-canvas
  const width = 400; // width of the canvas
  const height = 200; // height of the canvas
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const configuration = {
    type: 'bar',
    data: {
      labels: ['Salary', 'Expenses', 'Savings'],
      datasets: [{
        label: 'Financial Overview',
        data: [salary, expense, saving],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  require('fs').writeFileSync('financial_overview.png', image);
  console.log('Graph has been saved as financial_overview.png');
}

// Example usage
showAdviceAndGraph(22, 5000, 2000, 3000);
