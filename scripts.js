document.addEventListener('DOMContentLoaded', function() {
    const addExpenseButton = document.getElementById('addExpense');
    const expenseFields = document.getElementById('expenseFields');
    const totalExpenseInput = document.getElementById('totalExpense');
    const getAdviceButton = document.getElementById('getAdvice');
    const adviceDiv = document.getElementById('advice');
    let expenseCount = 1;

    addExpenseButton.addEventListener('click', function() {
        expenseCount++;
        const newExpenseField = document.createElement('div');
        newExpenseField.classList.add('expenseField');
        newExpenseField.innerHTML = `
            <label for="description${expenseCount}">Expense ${expenseCount} Description:</label>
            <input type="text" id="description${expenseCount}" name="description${expenseCount}" required>
            <label for="amount${expenseCount}">Expense ${expenseCount} Amount:</label>
            <input type="number" id="amount${expenseCount}" name="amount${expenseCount}" class="expenseAmount" required>
        `;
        expenseFields.appendChild(newExpenseField);
    });

    document.getElementById('financialForm').addEventListener('input', function() {
        const expenseAmountInputs = document.querySelectorAll('.expenseAmount');
        let totalExpense = 0;
        expenseAmountInputs.forEach(input => {
            totalExpense += parseFloat(input.value) || 0;
        });
        totalExpenseInput.value = totalExpense.toFixed(2);
    });

    getAdviceButton.addEventListener('click', async function() {
        const salary = document.getElementById('salary').value;
        const saving = document.getElementById('saving').value;
        const expense = totalExpenseInput.value;

        console.log('Sending request with data:', { age,salary, expense, saving });

        try {
            const response = await fetch('http://localhost:3000/getAdvice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({age, salary, expense, saving })
            });

            console.log('Response received:', response);

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();
            adviceDiv.innerText = data.advice;
        } catch (error) {
            console.error('Fetch error:', error);
            adviceDiv.innerText = `Error: ${error.message}`;
        }
    });
});
