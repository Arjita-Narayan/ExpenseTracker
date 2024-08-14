//1
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");
const filterCategory = document.getElementById("filter-category");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

//5
//Add Transaction
function addTransaction(e) {
  e.preventDefault();
  if (
    text.value.trim() === "" ||
    amount.value.trim() === "" ||
    date.value.trim() === "" ||
    category.value === "choose category"
  ) {
    alert("Please add text, amount, date, and choose a category");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: date.value,
      category: category.value, // Store category in the transaction
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = "";
    amount.value = "";
    date.value = "";
    category.value = "choose category"; // Reset category to default
  }
}

//5.5
//Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

//2

//Add Transactions to DOM list
function addTransactionDOM(transaction) {
  //GET sign
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  //Add Class Based on Value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  // Add the category label above the transaction details
  item.innerHTML = `
    <div class="category-label">(${transaction.category})</div>
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <span>${transaction.date}</span>
    <button class="delete-btn" onclick="removeTransaction(${
      transaction.id
    })">x</button>
    `;
  list.appendChild(item);
}

//4

//Update the balance income and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `Rs.${total}`;
  money_plus.innerText = `Rs.${income}`;
  money_minus.innerText = `Rs.${expense}`;
}

//6

//Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  Init();
}

//last
//Update Local Storage Transaction
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Add event listener for the filter
filterCategory.addEventListener("change", filterTransactions);

function filterTransactions() {
  const selectedCategory = filterCategory.value;

  // Clear the current list
  list.innerHTML = "";

  // Filter transactions
  const filteredTransactions =
    selectedCategory === "all"
      ? transactions
      : transactions.filter(
          (transaction) => transaction.category === selectedCategory
        );

  // Re-add the filtered transactions to the DOM
  filteredTransactions.forEach(addTransactionDOM);
  updateValues();
}

//3

//Init App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

Init();

form.addEventListener("submit", addTransaction);
