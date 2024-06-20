document.addEventListener('DOMContentLoaded', async function() {
    const myURL = new URL(document.URL)
    const id = myURL.searchParams.get("id")
    const myForm = new FormData()
    myForm.append("id", id)

    try {
        const response = await fetch(`/getData?id=${id}`);
        const financialData = await response.json();
        // Populate summary
        document.getElementById('income').textContent = `$${financialData.income}`;
        const totalExpenses = financialData.expenses.reduce((total, expense) => total + expense.amount, 0);
        document.getElementById('totalExpenses').textContent = `$${totalExpenses}`;
        document.getElementById('remainingBudget').textContent = `$${financialData.income - totalExpenses}`;

        // Populate and render chart
        const ctx = document.getElementById('expenseChart').getContext('2d');
        const expenseLabels = financialData.expenses.map(expense => expense.description);
        const expenseAmounts = financialData.expenses.map(expense => expense.amount);
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: expenseLabels,
                datasets: [{
                    label: 'Expense Amount',
                    data: expenseAmounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
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
        });
    } catch (err) {
        console.error(err);
    }
});
