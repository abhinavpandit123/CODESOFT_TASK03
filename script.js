let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let editTransactionId = null;


/* ELEMENTS */

const titleInput = document.getElementById("titleInput");
const amountInput = document.getElementById("amountInput");
const typeInput = document.getElementById("typeInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");

const saveBtn = document.getElementById("saveBtn");
const formTitle = document.getElementById("formTitle");
const errorMessage = document.getElementById("errorMessage");

const filterCategory =
    document.getElementById("filterCategory");

const transactionsContainer =
    document.getElementById("transactionsContainer");

const themeBtn =
    document.getElementById("themeBtn");


/* LOCAL STORAGE */

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


/* ADD / EDIT TRANSACTION */

function saveTransaction() {

    const title = titleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;


    /* VALIDATION */

    if (title === "") {

        errorMessage.textContent =
            "Please enter transaction title.";

        titleInput.focus();
        return;
    }

    if (isNaN(amount) || amount <= 0) {

        errorMessage.textContent =
            "Please enter a valid amount.";

        amountInput.focus();
        return;
    }

    if (date === "") {

        errorMessage.textContent =
            "Please select a date.";

        dateInput.focus();
        return;
    }


    errorMessage.textContent = "";


    /* EDIT */

    if (editTransactionId !== null) {

        const transaction =
            transactions.find(
                item => item.id === editTransactionId
            );

        if (transaction) {

            transaction.title = title;
            transaction.amount = amount;
            transaction.type = type;
            transaction.category = category;
            transaction.date = date;
        }

        editTransactionId = null;

        saveBtn.textContent = "Add Transaction";
        formTitle.textContent = "➕ Add Transaction";

    }

    /* ADD */

    else {

        const newTransaction = {

            id: Date.now(),

            title: title,

            amount: amount,

            type: type,

            category: category,

            date: date
        };

        transactions.push(newTransaction);
    }


    saveData();

    clearForm();

    displayTransactions();

}


/* CLEAR FORM */

function clearForm() {

    titleInput.value = "";

    amountInput.value = "";

    typeInput.value = "expense";

    categoryInput.value = "Food";

    dateInput.value =
        new Date().toISOString().split("T")[0];

}


/* DISPLAY TRANSACTIONS */

function displayTransactions() {

    const selectedCategory =
        filterCategory.value;


    let filteredTransactions =
        transactions.filter(transaction => {

            return (
                selectedCategory === "all" ||
                transaction.category === selectedCategory
            );

        });


    /* SORT BY DATE */

    filteredTransactions.sort(
        (a, b) =>
            new Date(b.date) - new Date(a.date)
    );


    if (filteredTransactions.length === 0) {

        transactionsContainer.innerHTML = `
            <div class="empty">

                <h3>📭 No Transactions Found</h3>

                <p>
                    Add your first income or expense
                    transaction.
                </p>

            </div>
        `;

        updateSummary();

        return;
    }


    transactionsContainer.innerHTML =
        filteredTransactions.map(transaction => {

            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const amount =
                sign +
                "₹" +
                Number(transaction.amount)
                    .toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                    });


            return `

                <div class="transaction ${transaction.type}">

                    <div class="transaction-info">

                        <div class="transaction-title">

                            ${escapeHTML(
                                transaction.title
                            )}

                        </div>


                        <div class="transaction-meta">

                            <span class="category-badge">

                                ${escapeHTML(
                                    transaction.category
                                )}

                            </span>

                            <span>

                                📅
                                ${formatDate(
                                    transaction.date
                                )}

                            </span>

                            <span>

                                ${
                                    transaction.type ===
                                    "income"
                                        ? "📈 Income"
                                        : "📉 Expense"
                                }

                            </span>

                        </div>

                    </div>


                    <div class="transaction-amount">

                        ${amount}

                    </div>


                    <div class="transaction-actions">

                        <button
                            class="action-btn edit-btn"
                            onclick="editTransaction(
                                ${transaction.id}
                            )">

                            ✏️

                        </button>


                        <button
                            class="action-btn delete-btn"
                            onclick="deleteTransaction(
                                ${transaction.id}
                            )">

                            🗑️

                        </button>

                    </div>

                </div>

            `;

        }).join("");


    updateSummary();

}


/* UPDATE FINANCIAL SUMMARY */

function updateSummary() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            totalIncome +=
                Number(transaction.amount);

        } else {

            totalExpense +=
                Number(transaction.amount);

        }

    });


    const balance =
        totalIncome - totalExpense;


    document.getElementById("income")
        .textContent =
        formatCurrency(totalIncome);


    document.getElementById("expense")
        .textContent =
        formatCurrency(totalExpense);


    document.getElementById("balance")
        .textContent =
        formatCurrency(balance);

}


/* EDIT */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) return;


    titleInput.value =
        transaction.title;

    amountInput.value =
        transaction.amount;

    typeInput.value =
        transaction.type;

    categoryInput.value =
        transaction.category;

    dateInput.value =
        transaction.date;


    editTransactionId = id;


    saveBtn.textContent =
        "Update Transaction";


    formTitle.textContent =
        "✏️ Edit Transaction";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* DELETE */

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) return;


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveData();

    displayTransactions();

}


/* FORMAT CURRENCY */

function formatCurrency(amount) {

    return "₹" +
        Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* FORMAT DATE */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* SECURITY */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* DARK MODE */

function toggleDarkMode() {

    document.body.classList.toggle("dark");


    const darkMode =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "expenseDarkMode",
        darkMode
    );


    themeBtn.textContent =
        darkMode ? "☀️" : "🌙";

}


function loadDarkMode() {

    const darkMode =
        localStorage.getItem(
            "expenseDarkMode"
        ) === "true";


    if (darkMode) {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";

    }

}


/* EVENTS */

saveBtn.addEventListener(
    "click",
    saveTransaction
);


themeBtn.addEventListener(
    "click",
    toggleDarkMode
);


filterCategory.addEventListener(
    "change",
    displayTransactions
);


/* DEFAULT DATE */

dateInput.value =
    new Date()
        .toISOString()
        .split("T")[0];


/* INITIAL LOAD */

loadDarkMode();

displayTransactions();