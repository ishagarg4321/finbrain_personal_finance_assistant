// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const path = require("path");
// const cors = require("cors");
// const { JSDOM } = require('jsdom');
// const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
// const fs = require('fs');
// const app = express();
// const axios = require("axios").default;
// const { LMStudioClient } = require("@lmstudio/sdk");

// const port = 3000;
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(express.static('public'));

// // Connect to MongoDB for both databases
// mongoose
//   .connect("mongodb://localhost:27017/signupDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to signupDB");
//     // Now that the first connection is established, connect to the second database
//     return mongoose.createConnection(
//       "mongodb://localhost:27017/financialData",
//       { useNewUrlParser: true, useUnifiedTopology: true }
//     );
//   })
//   .then(() => console.log("Connected to financialData"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// // Create a schema and model for the user
// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
// });
// const User = mongoose.model("User", userSchema);

// // Create a schema and model for financial data
// const financialSchema = new mongoose.Schema({
//   income: Number,
//   expenses: [
//     {
//       description: String,
//       amount: Number,
//     },
//   ],
// });
// const FinancialData = mongoose.model("FinancialData", financialSchema);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

// // Serve the home.html file when the root route is requested
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "home.html"));
// });

// // Handle POST requests to /signup
// app.post("/signup", (req, res) => {
//   const newUser = new User({
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//   });

//   newUser
//     .save()
//     .then(() => {
//       res.status(200).send("User registered successfully!");
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// });

// // Handle POST requests to /login for user login
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   // Check if the user exists in the database
//   User.findOne({ email: email, password: password })
//     .then((user) => {
//       if (user) {
//         // If user exists, redirect to index.html
//         res.sendFile(path.join(__dirname, "public", "index.html"));
//       } else {
//         // If user does not exist, send error message
//         res.status(404).send("User not found!");
//       }
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// });

// // Handle POST requests to /submit for financial data submission
// // Handle POST requests to /submit
// app.post("/submit", async (req, res) => {
//   try {
//     // Create a new document with submitted financial data
//     const financialData = new FinancialData({
//       income: req.body.income,
//       expenses: [
//         {
//           description: req.body.description1,
//           amount: req.body.amount1,
//           category: calculateCategory(req.body.description1), // Automatically determine category based on description
//         },
//       ],
//       // Add more expenses if needed
//     });
//     await financialData.save();
//     res.redirect(`/display?id=${financialData._id}`);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Function to calculate category based on description (example logic)
// function calculateCategory(description) {
//   // Convert description to lowercase for case-insensitive comparison
//   description = description.toLowerCase();

//   // Check for keywords to categorize as 'needed'
//   if (
//     description.includes("grocery") ||
//     description.includes("food") ||
//     description.includes("utilities")
//   ) {
//     return "needed";
//   }
//   // Check for keywords to categorize as 'unneeded'
//   else if (
//     description.includes("luxury") ||
//     description.includes("entertainment") ||
//     description.includes("vacation")
//   ) {
//     return "unneeded";
//   }
//   // If none of the specific conditions are met, default to 'unneeded'
//   else {
//     return "unneeded";
//   }
// }

// // Route to serve display page
// app.get("/display", async (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "display.html"));
// });

// // Route to fetch financial data from the database
// app.get("/getData", async (req, res) => {
//   const id = req.query.id;
//   const data = await FinancialData.findOne({
//     _id: id,
//   });
//   res.send(data);
// });
// app.post("/getAdvice", async (req, res) => {
//   const { age, salary, expense, saving } = req.body;

//   try {
//     const advice = await getAIAdvice(age, salary, expense, saving);
//     res.json({ advice });
//   } catch (error) {
//     console.error("Error generating AI advice:", error);
//     res.status(500).json({ error: "Failed to generate advice" });
//   }
// });
// // Function to get the total expense from the HTML file
// function getTotalExpenseFromHTML() {
//     const html = fs.readFileSync('public/index.html', 'utf-8');
//     const dom = new JSDOM(html);
//     const totalExpense = dom.window.document.getElementById('totalExpense').textContent;
//     return parseFloat(totalExpense);
//   }
// async function getAIAdvice(age, salary, expense, saving) {
//   const res = await axios.post("http://localhost:1234/v1/chat/completions", {
//     model: "TheBloke/phi-2-GGUF/phi-2.Q4_K_S.gguf:5",
//     messages: [
//       { role: "system", content: "You are a helpful AI financial assistant and adviser. please advice for inverstement in equity" },
//       {
//         role: "user",
//         content: `i age is 22 and  salary is ${salary} expense is ${expense} saving ${saving} .advice me for 1 month`,
//       },
//     ],
//   });
//   return res.data?.choices?.[0]?.message?.content;
//   return advice;
// }
// // Function to get the total expense from the HTML file
// function getTotalExpenseFromHTML() {
//     const html = fs.readFileSync('public/example.html', 'utf-8');
//     const dom = new JSDOM(html);
//     const totalExpense = dom.window.document.getElementById('totalexpense').textContent;
//     return parseFloat(totalExpense);
//   }
// // Function to generate the graph image
// async function generateGraphImage(salary, expenses, savings) {
//     const width = 400; // width of the canvas
//     const height = 200; // height of the canvas
//     const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  
//     const configuration = {
//       type: 'bar',
//       data: {
//         labels: ['Salary', 'Expenses', 'Savings'],
//         datasets: [{
//           label: 'Financial Overview',
//           data: [salary, expenses, savings],
//           backgroundColor: [
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(255, 99, 132, 0.2)',
//             'rgba(54, 162, 235, 0.2)'
//           ],
//           borderColor: [
//             'rgba(75, 192, 192, 1)',
//             'rgba(255, 99, 132, 1)',
//             'rgba(54, 162, 235, 1)'
//           ],
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         }
//       }
//     };
  
//     return await chartJSNodeCanvas.renderToBuffer(configuration);
//   }
  
//   // Route to serve the graph image
//   app.post('/graph', async (req, res) => {
//     const salary = parseFloat(req.body.salary);
//     const expenses = parseFloat(req.body.expenses);
//     const savings = parseFloat(req.body.savings);
  
//     try {
//       const imageBuffer = await generateGraphImage(salary, expenses, savings);
//       res.set('Content-Type', 'image/png');
//       res.send(imageBuffer);
//     } catch (error) {
//       console.error('Error generating graph:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   });
  
//   // Route to serve the webpage with the form and the graph
//   app.get('/', (req, res) => {
//     const html = `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Financial Overview</title>
//       </head>
//       <body>
//         <h1>Financial Overview</h1>
//         <form action="/graph" method="post">
//           <label for="salary">Salary:</label>
//           <input type="number" id="salary" name="salary" required><br><br>
//           <label for="expenses">Expenses:</label>
//           <input type="number" id="expenses" name="expenses" required><br><br>
//           <label for="savings">Savings:</label>
//           <input type="number" id="savings" name="savings" required><br><br>
//           <button type="submit">Generate Graph</button>
//         </form>
//         <div id="graphContainer"></div>
//         <script>
//           document.querySelector('form').addEventListener('submit', async (event) => {
//             event.preventDefault();
//             const form = event.target;
//             const formData = new FormData(form);
//             const response = await fetch(form.action, {
//               method: form.method,
//               body: formData
//             });
//             const graphImage = await response.blob();
//             const imageUrl = URL.createObjectURL(graphImage);
//             const graphContainer = document.getElementById('graphContainer');
//             graphContainer.innerHTML = '<h2>Financial Overview Graph</h2>';
//             const img = document.createElement('img');
//             img.src = imageUrl;
//             graphContainer.appendChild(img);
//           });
//         </script>
//       </body>
//       </html>
//     `;
//     res.send(html);
//   });
  
// app.listen(port, () => {
//   console.log("server is running on port 3000");
//   console.log(`Server running at http://localhost:${port}/`);
// });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const { JSDOM } = require('jsdom');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const app = express();
const axios = require("axios").default;
const { LMStudioClient } = require("@lmstudio/sdk");

const port = 3001;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB for both databases
mongoose
  .connect("mongodb://localhost:27017/signupDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to signupDB");
    // Now that the first connection is established, connect to the second database
    return mongoose.createConnection(
      "mongodb://localhost:27017/financialData",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
  })
  .then(() => console.log("Connected to financialData"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Create a schema and model for the user
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Create a schema and model for financial data
const financialSchema = new mongoose.Schema({
  income: Number,
  expenses: [
    {
      description: String,
      amount: Number,
    },
  ],
});
const FinancialData = mongoose.model("FinancialData", financialSchema);

// Serve the home.html file when the root route is requested
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Handle POST requests to /signup
app.post("/signup", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  newUser
    .save()
    .then(() => {
      // res.status(200).send("User registered successfully!");
      res.sendFile(path.join(__dirname, "public", "index.html"))
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Handle POST requests to /login for user login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
  // Check if the user exists in the database
  User.findOne({ email: email, password: password })
    .then((user) => {
      if (user) {
        // If user exists, redirect to index.html
        ;
      } else {
        // If user does not exist, send error message
        res.status(404).send("User not found!");
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Handle POST requests to /submit for financial data submission
app.post("/submit", async (req, res) => {
  try {
    // Create a new document with submitted financial data
    const financialData = new FinancialData({
      income: req.body.income,
      expenses: [
        {
          description: req.body.description1,
          amount: req.body.amount1,
          category: calculateCategory(req.body.description1), // Automatically determine category based on description
        },
      ],
      // Add more expenses if needed
    });
    await financialData.save();
    res.redirect(`/display?id=${financialData._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Function to calculate category based on description (example logic)
function calculateCategory(description) {
  // Convert description to lowercase for case-insensitive comparison
  description = description.toLowerCase();

  // Check for keywords to categorize as 'needed'
  if (
    description.includes("grocery") ||
    description.includes("food") ||
    description.includes("utilities")
  ) {
    return "needed";
  }
  // Check for keywords to categorize as 'unneeded'
  else if (
    description.includes("luxury") ||
    description.includes("entertainment") ||
    description.includes("vacation")
  ) {
    return "unneeded";
  }
  // If none of the specific conditions are met, default to 'unneeded'
  else {
    return "unneeded";
  }
}

// Route to serve display page
app.get("/display", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "display.html"));
});

// Route to fetch financial data from the database
app.get("/getData", async (req, res) => {
  const id = req.query.id;
  const data = await FinancialData.findOne({
    _id: id,
  });
  res.send(data);
});

// Route to fetch financial advice
// Route to fetch financial advice
app.post("/getAdvice", async (req, res) => {
    const { age, salary, expense, saving } = req.body;
  
    try {
      const advice = await getAIAdvice(age, salary, expense, saving);
      res.json({ advice });
    } catch (error) {
      console.error("Error generating AI advice:", error);
      res.status(500).json({ error: "Failed to generate advice" });
    }
  });
  
  // Function to generate financial advice using AI
  async function getAIAdvice(age, salary, expense, saving) {
    const res = await axios.post("http://localhost:1234/v1/chat/completions", {
      model: "TheBloke/phi-2-GGUF/phi-2.Q4_K_S.gguf:5",
      messages: [
        { role: "system", content: "You are a helpful AI financial assistant and adviser. please advice for inverstement in equity" },
        {
          role: "user",
          content: `I am ${age} years old, my salary is ${salary}, expenses are ${expense}, and savings are ${saving}. Please advise me for 1 month.`,
        },
      ],
    });
    return res.data?.choices?.[0]?.message?.content;
  }
  // Function to generate the graph image
async function generateGraphImage(salary, totalExpenses, saving) {
    const width = 400; // width of the canvas
    const height = 200; // height of the canvas
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  
    const configuration = {
      type: 'bar',
      data: {
        labels: ['Salary', 'Expenses', 'Savings'],
        datasets: [{
          label: 'Financial Overview',
          data: [salary, totalExpenses, saving],
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
    return image;
  }
  
  // Route to serve the graph image
  app.get('/graph', async (req, res) => {
    const totalExpenses = getTotalExpenseFromHTML();
    const salary = 5000; // Example salary (replace with actual value)
    const saving = 3000; // Example saving (replace with actual value)
    try {
      const imageBuffer = await generateGraphImage(salary, totalExpenses, saving);
      res.set('Content-Type', 'image/png');
      res.send(imageBuffer);
    } catch (error) {
      console.error('Error generating graph:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Server running at http://localhost:${port}/`);
  });