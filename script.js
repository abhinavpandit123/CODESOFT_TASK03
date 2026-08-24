/* =========================================
   MONEY MATE - EXPENSE TRACKER
========================================= */


/* DATA */

let transactions =
    JSON.parse(
        localStorage.getItem("moneyMateTransactions")
    ) || [];

let editTransactionId = null;


/* =========================================
   ELEMENTS
========================================= */

const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expenseElement =
    document.getElementById("expense");

const savingsElement =
    document.getElementById("savings");

const heroIncome =
    document.getElementById("heroIncome");

const heroExpense =
    document.getElementById("heroExpense");

const incomePageTotal =
    document.getElementById("incomePageTotal");

const expensePageTotal =
    document.getElementById("expensePageTotal");

const analyticsIncome =
    document.getElementById("analyticsIncome");

const analyticsExpense =
    document.getElementById("analyticsExpense");

const analyticsSavings =
    document.getElementById("analyticsSavings");


/* FORM */

const titleInput =
    document.getElementById("titleInput");

const amountInput =
    document.getElementById("amountInput");

const typeInput =
    document.getElementById("typeInput");

const categoryInput =
    document.getElementById("categoryInput");

const dateInput =
    document.getElementById("dateInput");

const saveBtn =
    document.getElementById("saveBtn");

const formHeading =
    document.getElementById("formHeading");

const errorMessage =
    document.getElementById("errorMessage");


/* ADD MONEY */

const incomeAmount =
    document.getElementById("incomeAmount");

const incomeSource =
    document.getElementById("incomeSource");

const addIncomeBtn =
    document.getElementById("addIncomeBtn");

const incomeError =
    document.getElementById("incomeError");


/* FILTERS */

const dashboardFilter =
    document.getElementById("dashboardFilter");

const expenseFilter =
    document.getElementById("expenseFilter");


/* CONTAINERS */

const dashboardTransactions =
    document.getElementById(
        "dashboardTransactions"
    );

const incomeTransactions =
    document.getElementById(
        "incomeTransactions"
    );

const expenseTransactions =
    document.getElementById(
        "expenseTransactions"
    );

const categoryAnalytics =
    document.getElementById(
        "categoryAnalytics"
    );

const insights =
    document.getElementById("insights");


/* =========================================
   LOCAL STORAGE
========================================= */

function saveData() {

    localStorage.setItem(
        "moneyMateTransactions",
        JSON.stringify(transactions)
    );

}


/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(amount) {

    return "₹" +
        Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =========================================
   DATE
========================================= */

function getToday() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


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


/* =========================================
   CALCULATIONS
========================================= */

function calculateTotals() {

    let income = 0;

    let expense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += Number(
                transaction.amount
            );

        } else {

            expense += Number(
                transaction.amount
            );

        }

    });


    return {

        income: income,

        expense: expense,

        balance: income - expense

    };

}


/* =========================================
   UPDATE DASHBOARD
========================================= */

function updateDashboard() {

    const totals =
        calculateTotals();


    balanceElement.textContent =
        formatMoney(totals.balance);


    incomeElement.textContent =
        formatMoney(totals.income);


    expenseElement.textContent =
        formatMoney(totals.expense);


    savingsElement.textContent =
        formatMoney(totals.balance);


    heroIncome.textContent =
        formatMoney(totals.income);


    heroExpense.textContent =
        formatMoney(totals.expense);


    incomePageTotal.textContent =
        formatMoney(totals.income);


    expensePageTotal.textContent =
        formatMoney(totals.expense);


    analyticsIncome.textContent =
        formatMoney(totals.income);


    analyticsExpense.textContent =
        formatMoney(totals.expense);


    analyticsSavings.textContent =
        formatMoney(totals.balance);

}


/* =========================================
   ADD MONEY
========================================= */

function addIncome() {

    const amount =
        parseFloat(
            incomeAmount.value
        );

    const source =
        incomeSource.value.trim();


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        incomeError.textContent =
            "Please enter a valid amount.";

        return;

    }


    if (source === "") {

        incomeError.textContent =
            "Please enter income source.";

        return;

    }


    incomeError.textContent = "";


    transactions.push({

        id: Date.now(),

        title: source,

        amount: amount,

        type: "income",

        category: "Salary",

        date: getToday()

    });


    saveData();


    incomeAmount.value = "";

    incomeSource.value = "";


    refreshEverything();

}


/* =========================================
   ADD / EDIT TRANSACTION
========================================= */

function saveTransaction() {

    const title =
        titleInput.value.trim();

    const amount =
        parseFloat(
            amountInput.value
        );

    const type =
        typeInput.value;

    const category =
        categoryInput.value;

    const date =
        dateInput.value;


    if (title === "") {

        errorMessage.textContent =
            "Please enter transaction title.";

        titleInput.focus();

        return;

    }


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        errorMessage.textContent =
            "Please enter a valid amount.";

        amountInput.focus();

        return;

    }


    if (date === "") {

        errorMessage.textContent =
            "Please select a date.";

        return;

    }


    errorMessage.textContent = "";


    /* EDIT */

    if (editTransactionId !== null) {

        const transaction =
            transactions.find(
                item =>
                    item.id ===
                    editTransactionId
            );


        if (transaction) {

            transaction.title =
                title;

            transaction.amount =
                amount;

            transaction.type =
                type;

            transaction.category =
                category;

            transaction.date =
                date;

        }


        editTransactionId = null;


        saveBtn.textContent =
            "Add Transaction";


        formHeading.textContent =
            "Add Transaction";

    }


    /* ADD */

    else {

        transactions.push({

            id: Date.now(),

            title: title,

            amount: amount,

            type: type,

            category: category,

            date: date

        });

    }


    saveData();

    clearForm();

    refreshEverything();

}


/* =========================================
   CLEAR FORM
========================================= */

function clearForm() {

    titleInput.value = "";

    amountInput.value = "";

    typeInput.value = "expense";

    categoryInput.value = "Food";

    dateInput.value = getToday();

}


/* =========================================
   TRANSACTION HTML
========================================= */

function transactionHTML(transaction) {

    const isIncome =
        transaction.type === "income";


    const sign =
        isIncome ? "+" : "-";


    const icon =
        isIncome
            ? "💰"
            : getCategoryIcon(
                transaction.category
            );


    return `

        <div class="transaction ${transaction.type}">

            <div class="transaction-icon">
                ${icon}
            </div>


            <div class="transaction-info">

                <div class="transaction-title">

                    ${escapeHTML(
                        transaction.title
                    )}

                </div>

                <div class="transaction-meta">

                    ${escapeHTML(
                        transaction.category
                    )}

                    &nbsp; • &nbsp;

                    ${formatDate(
                        transaction.date
                    )}

                </div>

            </div>


            <div class="transaction-amount">

                ${sign}${formatMoney(
                    transaction.amount
                )}

            </div>


            <div class="actions">

                <button
                    class="action-btn edit-btn"
                    onclick="editTransaction(
                        ${transaction.id}
                    )"
                >
                    ✏️
                </button>


                <button
                    class="action-btn delete-btn"
                    onclick="deleteTransaction(
                        ${transaction.id}
                    )"
                >
                    🗑️
                </button>

            </div>

        </div>

    `;

}


/* =========================================
   DISPLAY DASHBOARD TRANSACTIONS
========================================= */

function displayDashboardTransactions() {

    const filter =
        dashboardFilter.value;


    let data =
        [...transactions];


    if (filter !== "all") {

        data =
            data.filter(
                transaction =>
                    transaction.category ===
                    filter
            );

    }


    data.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    if (data.length === 0) {

        dashboardTransactions.innerHTML =
            emptyHTML();

        return;

    }


    dashboardTransactions.innerHTML =
        data.slice(0, 8)
            .map(transactionHTML)
            .join("");

}


/* =========================================
   DISPLAY INCOME
========================================= */

function displayIncomeTransactions() {

    let data =
        transactions.filter(
            transaction =>
                transaction.type ===
                "income"
        );


    data.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    if (data.length === 0) {

        incomeTransactions.innerHTML =
            emptyHTML(
                "No income transactions found."
            );

        return;

    }


    incomeTransactions.innerHTML =
        data
            .map(transactionHTML)
            .join("");

}


/* =========================================
   DISPLAY EXPENSES
========================================= */

function displayExpenseTransactions() {

    const filter =
        expenseFilter.value;


    let data =
        transactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        );


    if (filter !== "all") {

        data =
            data.filter(
                transaction =>
                    transaction.category ===
                    filter
            );

    }


    data.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    if (data.length === 0) {

        expenseTransactions.innerHTML =
            emptyHTML(
                "No expense transactions found."
            );

        return;

    }


    expenseTransactions.innerHTML =
        data
            .map(transactionHTML)
            .join("");

}


/* =========================================
   EDIT
========================================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) return;


    editTransactionId = id;


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


    formHeading.textContent =
        "Edit Transaction";


    saveBtn.textContent =
        "Update Transaction";


    showPage("dashboard");


    setTimeout(() => {

        document
            .querySelector(
                ".transaction-form"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }, 100);

}


/* =========================================
   DELETE
========================================= */

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

    refreshEverything();

}


/* =========================================
   ANALYTICS
========================================= */

function updateAnalytics() {

    const expenses =
        transactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        );


    const categoryTotals = {};


    expenses.forEach(transaction => {

        if (
            !categoryTotals[
                transaction.category
            ]
        ) {

            categoryTotals[
                transaction.category
            ] = 0;

        }


        categoryTotals[
            transaction.category
        ] += Number(
            transaction.amount
        );

    });


    const sorted =
        Object.entries(
            categoryTotals
        ).sort(
            (a, b) => b[1] - a[1]
        );


    const totalExpense =
        calculateTotals().expense;


    if (sorted.length === 0) {

        categoryAnalytics.innerHTML =
            emptyHTML(
                "Add expenses to see category analytics."
            );

    } else {

        categoryAnalytics.innerHTML =
            sorted.map(item => {

                const category =
                    item[0];

                const amount =
                    item[1];


                const percentage =
                    totalExpense > 0
                        ? (
                            amount /
                            totalExpense
                        ) * 100
                        : 0;


                return `

                    <div class="category-row">

                        <div class="category-info">

                            <span>
                                ${getCategoryIcon(
                                    category
                                )}
                                ${escapeHTML(
                                    category
                                )}
                            </span>

                            <strong>
                                ${formatMoney(
                                    amount
                                )}
                            </strong>

                        </div>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width:${percentage}%"
                            ></div>

                        </div>

                    </div>

                `;

            }).join("");

    }


    /* INSIGHTS */

    const totals =
        calculateTotals();


    let highestCategory =
        sorted.length > 0
            ? sorted[0][0]
            : "None";


    let highestAmount =
        sorted.length > 0
            ? sorted[0][1]
            : 0;


    let savingsRate = 0;


    if (totals.income > 0) {

        savingsRate =
            (
                totals.balance /
                totals.income
            ) * 100;

    }


    insights.innerHTML = `

        <div class="insight">

            <strong>
                🏆 Highest Expense Category
            </strong>

            <span>
                ${highestCategory}
                ${
                    highestAmount > 0
                        ? " — " +
                          formatMoney(
                              highestAmount
                          )
                        : ""
                }
            </span>

        </div>


        <div class="insight">

            <strong>
                💎 Savings Rate
            </strong>

            <span>
                ${savingsRate.toFixed(1)}%
                of your income is remaining.
            </span>

        </div>


        <div class="insight">

            <strong>
                🧾 Total Transactions
            </strong>

            <span>
                ${transactions.length}
                transactions recorded.
            </span>

        </div>

    `;

}


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageName) {

    const pages = {

        dashboard:
            document.getElementById(
                "dashboardPage"
            ),

        income:
            document.getElementById(
                "incomePage"
            ),

        expenses:
            document.getElementById(
                "expensesPage"
            ),

        analytics:
            document.getElementById(
                "analyticsPage"
            )

    };


    Object.values(pages).forEach(page => {

        page.classList.remove(
            "active-page"
        );

    });


    pages[pageName]
        .classList.add(
            "active-page"
        );


    /* TITLE */

    const titles = {

        dashboard:
            "Financial Dashboard",

        income:
            "Income Management",

        expenses:
            "Expense Management",

        analytics:
            "Financial Analytics"

    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[pageName];


    /* ACTIVE NAV */

    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.page ===
                pageName
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


    /* UPDATE PAGE */

    if (pageName === "analytics") {

        updateAnalytics();

    }

}


/* =========================================
   OPEN DASHBOARD FORM
========================================= */

function openDashboardForm(type) {

    showPage("dashboard");


    typeInput.value = type;


    setTimeout(() => {

        document
            .querySelector(
                ".transaction-form"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }, 100);

}


/* =========================================
   EMPTY
========================================= */

function emptyHTML(
    message = "No transactions found."
) {

    return `

        <div class="empty">

            <h3>📭 Nothing Here</h3>

            <p>${message}</p>

        </div>

    `;

}


/* =========================================
   CATEGORY ICON
========================================= */

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Shopping: "🛍️",

        Transport: "🚗",

        Bills: "💡",

        Entertainment: "🎬",

        Health: "🏥",

        Education: "📚",

        Salary: "💼",

        Freelance: "💻",

        Other: "📦"

    };


    return icons[category] || "💸";

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}


/* =========================================
   DARK MODE
========================================= */

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "moneyMateDarkMode",
        isDark
    );


    document.getElementById(
        "themeBtn"
    ).textContent =
        isDark ? "☀️" : "🌙";

}


function loadDarkMode() {

    const isDark =
        localStorage.getItem(
            "moneyMateDarkMode"
        ) === "true";


    if (isDark) {

        document.body.classList.add(
            "dark"
        );


        document.getElementById(
            "themeBtn"
        ).textContent =
            "☀️";

    }

}


/* =========================================
   REFRESH EVERYTHING
========================================= */

function refreshEverything() {

    updateDashboard();

    displayDashboardTransactions();

    displayIncomeTransactions();

    displayExpenseTransactions();

    updateAnalytics();

}


/* =========================================
   EVENTS
========================================= */


/* Sidebar */

document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showPage(
                    button.dataset.page
                );

            }
        );

    });


/* Save */

saveBtn.addEventListener(
    "click",
    saveTransaction
);


/* Add income */

addIncomeBtn.addEventListener(
    "click",
    addIncome
);


/* Theme */

document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        toggleDarkMode
    );


/* Filters */

dashboardFilter.addEventListener(
    "change",
    displayDashboardTransactions
);


expenseFilter.addEventListener(
    "change",
    displayExpenseTransactions
);


/* Enter key for Add Money */

incomeSource.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addIncome();

        }

    }
);


/* =========================================
   INITIALIZATION
========================================= */

dateInput.value =
    getToday();


loadDarkMode();


refreshEverything();
