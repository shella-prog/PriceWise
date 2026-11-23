/* PRICEWISE JAVASCRIPT
   Object-Oriented Programming:
   Classes, Objects, Constructors, Methods, and Arrays
*/

// PRODUCT CLASS
class GroceryProduct {

    constructor(name, storeOne, priceOne, storeTwo, priceTwo) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.storeOne = storeOne;
        this.priceOne = Number(priceOne);
        this.storeTwo = storeTwo;
        this.priceTwo = Number(priceTwo);
    }

    getCheaperStore() {

        if (this.priceOne === this.priceTwo) {
            return {
                store: "Both stores",
                savings: 0
            };
        }

        return this.priceOne < this.priceTwo
            ? {
                store: this.storeOne,
                savings: this.priceTwo - this.priceOne
            }
            : {
                store: this.storeTwo,
                savings: this.priceOne - this.priceTwo
            };
    }
}


// EXPENSE CLASS
class Expense {

    constructor(name, amount) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.amount = Number(amount);
        this.date = new Date().toLocaleDateString();
    }
}


// SHOPPING LIST CLASS
class ShoppingItem {

    constructor(name, quantity) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.quantity = Number(quantity);
        this.completed = false;
    }
}


// MAIN APPLICATION CLASS
class PriceWiseApp {

    constructor() {
        this.products = JSON.parse(
            localStorage.getItem("products") || "[]"
        );

        this.expenses = JSON.parse(
            localStorage.getItem("expenses") || "[]"
        );

        this.shoppingItems = JSON.parse(
            localStorage.getItem("shoppingItems") || "[]"
        );

        this.budget = Number(
            localStorage.getItem("budget") || 0
        );
    }

    saveData() {
        localStorage.setItem(
            "products", JSON.stringify(this.products)
        );

        localStorage.setItem(
            "expenses", JSON.stringify(this.expenses)
        );

        localStorage.setItem(
            "shoppingItems", JSON.stringify(this.shoppingItems)
        );

        localStorage.setItem(
            "budget", this.budget
        );
    }

    getTotalExpenses() {
        return this.expenses.reduce(
            (total, item) => total + Number(item.amount), 0
        );
    }

    getPotentialSavings() {
        return this.products.reduce((total, item) => {
            return total + Math.abs(
                Number(item.priceOne) - Number(item.priceTwo)
            );
        }, 0);
    }

    addProduct(product) {
        this.products.unshift(product);
        this.saveData();
    }

    addExpense(expense) {
        this.expenses.unshift(expense);
        this.saveData();
    }

    addShoppingItem(item) {
        this.shoppingItems.unshift(item);
        this.saveData();
    }

    removeItem(arrayName, id) {
        this[arrayName] = this[arrayName].filter(
            item => String(item.id) !== String(id)
        );
        this.saveData();
    }
}


// CREATE APPLICATION OBJECT
const app = new PriceWiseApp();


// CURRENCY FORMAT
function peso(amount) {
    return "₱" + Number(amount || 0).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


// HAMBURGER MENU AND HOW IT WORKS
const menuToggle = document.getElementById("menuToggle");
const openInfo = document.getElementById("openInfo");

function getNavbar() {
    return document.querySelector(".navbar") ||
        document.getElementById("navMenu") ||
        document.querySelector("nav");
}

function getInfoModal() {
    return document.getElementById("infoModal") ||
        document.getElementById("howItWorks");
}

function setMenu(open) {
    const navbar = getNavbar();

    if (!navbar || !menuToggle) return;

    navbar.classList.toggle("open", open);
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
}

if (menuToggle) {
    menuToggle.addEventListener("click", function () {
        const navbar = getNavbar();

        if (!navbar) return;

        setMenu(!navbar.classList.contains("open"));
    });

    const navbar = getNavbar();

    if (navbar) {
        navbar.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function () {
                setMenu(false);
            });
        });
    }
}

if (openInfo) {
    openInfo.addEventListener("click", function () {
        const modal = getInfoModal();

        if (!modal) return;

        if (typeof modal.showModal === "function") {
            if (!modal.open) {
                modal.showModal();
            }
        } else {
            modal.setAttribute("open", "");
        }
    });
}

(function () {
    const modal = getInfoModal();

    if (!modal) return;

    function closeModal() {
        if (typeof modal.close === "function") {
            modal.close();
        } else {
            modal.removeAttribute("open");
        }
    }

    modal.querySelectorAll(".modal-close, .btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            closeModal();
        });
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
})();


// IMAGE UPLOAD AND CAMERA PREVIEW
const productImage = document.getElementById("productImage");

productImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select an image.");
        this.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        document.getElementById("imagePreview").src =
            event.target.result;

        document.getElementById("imageContainer").hidden = false;
    };

    reader.readAsDataURL(file);
});


// COMPARE GROCERY PRICES
document.getElementById("compareBtn")
    .addEventListener("click", function () {

        const name = document.getElementById("productName").value.trim();
        const storeOne = document.getElementById("storeOne").value.trim();
        const storeTwo = document.getElementById("storeTwo").value.trim();

        const priceOneInput = document.getElementById("priceOne").value;
        const priceTwoInput = document.getElementById("priceTwo").value;

        const priceOne = Number(priceOneInput);
        const priceTwo = Number(priceTwoInput);

        const message = document.getElementById("compareMessage");

        if (
            !name || !storeOne || !storeTwo ||
            priceOneInput === "" || priceTwoInput === ""
        ) {
            message.textContent = "Please complete all product and price fields.";
            return;
        }

        if (
            !Number.isFinite(priceOne) ||
            !Number.isFinite(priceTwo) ||
            priceOne < 0 ||
            priceTwo < 0
        ) {
            message.textContent = "Please enter valid prices.";
            return;
        }

        const product = new GroceryProduct(
            name,
            storeOne,
            priceOne,
            storeTwo,
            priceTwo
        );

        app.addProduct(product);

        showComparison(product);
        showSavedProducts();
        updateDashboard();

        message.textContent = "Product comparison saved successfully!";

        document.getElementById("productName").value = "";
        document.getElementById("storeOne").value = "";
        document.getElementById("storeTwo").value = "";
        document.getElementById("priceOne").value = "";
        document.getElementById("priceTwo").value = "";
    });


// DISPLAY COMPARISON RESULT
function showComparison(product) {

    const result = document.getElementById("comparisonResults");

    const cheaper = product.getCheaperStore();

    const box = document.createElement("div");
    box.className = "result-box";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const first = document.createElement("p");
    first.textContent =
        `${product.storeOne}: ${peso(product.priceOne)}`;

    const second = document.createElement("p");
    second.textContent =
        `${product.storeTwo}: ${peso(product.priceTwo)}`;

    const winner = document.createElement("p");
    winner.className = "winner";

    winner.textContent = cheaper.savings === 0
        ? "Both stores have the same price."
        : `${cheaper.store} is cheaper! You could save ${peso(cheaper.savings)}.`;

    box.append(title, first, second, winner);

    result.prepend(box);
}


// DISPLAY SAVED PRODUCTS
function showSavedProducts() {

    const container = document.getElementById("savedComparisons");

    container.innerHTML = "";

    app.products.forEach(product => {

        const cheaper = Number(product.priceOne) < Number(product.priceTwo)
            ? product.storeOne
            : Number(product.priceTwo) < Number(product.priceOne)
                ? product.storeTwo
                : "Both stores";

        const row = document.createElement("div");
        row.className = "saved-item";

        const text = document.createElement("span");
        text.textContent = `${product.name} - ${cheaper}`;

        const remove = document.createElement("button");
        remove.className = "delete-btn";
        remove.textContent = "Remove";

        remove.addEventListener("click", function () {
            app.removeItem("products", product.id);
            showSavedProducts();
            updateDashboard();
        });

        row.append(text, remove);
        container.appendChild(row);
    });
}


// SAVE GROCERY BUDGET
document.getElementById("saveBudgetBtn")
    .addEventListener("click", function () {

        const amount = document.getElementById("budgetAmount").value;

        if (amount === "" || !Number.isFinite(Number(amount)) || Number(amount) < 0) {
            alert("Please enter a valid budget.");
            return;
        }

        app.budget = Number(amount);
        app.saveData();

        updateDashboard();

        document.getElementById("budgetMessage").textContent =
            "Your grocery budget has been saved!";
    });


// ADD EXPENSE
document.getElementById("addExpenseBtn")
    .addEventListener("click", function () {

        const name = document.getElementById("expenseName").value.trim();
        const amountInput = document.getElementById("expenseAmount").value;
        const amount = Number(amountInput);

        if (!name || amountInput === "" || !Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid expense name and amount.");
            return;
        }

        const expense = new Expense(name, amount);

        app.addExpense(expense);

        document.getElementById("expenseName").value = "";
        document.getElementById("expenseAmount").value = "";

        showExpenses();
        updateDashboard();
    });


// DISPLAY EXPENSES
function showExpenses() {

    const list = document.getElementById("expenseList");

    list.innerHTML = "";

    app.expenses.forEach(expense => {

        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent =
            `${expense.name} - ${peso(expense.amount)} (${expense.date})`;

        const remove = document.createElement("button");
        remove.className = "delete-btn";
        remove.textContent = "Remove";

        remove.addEventListener("click", function () {

            app.removeItem("expenses", expense.id);

            showExpenses();
            updateDashboard();
        });

        li.append(text, remove);
        list.appendChild(li);
    });

    document.getElementById("expenseEmpty").hidden =
        app.expenses.length > 0;

    document.getElementById("totalExpenses").textContent =
        peso(app.getTotalExpenses());

    updateBudgetDisplay();
}


// ADD SHOPPING LIST ITEM
document.getElementById("addShoppingBtn")
    .addEventListener("click", function () {

        const name = document.getElementById("shoppingItem").value.trim();

        const quantity = Number(
            document.getElementById("shoppingQuantity").value
        );

        if (!name || !Number.isInteger(quantity) || quantity < 1) {
            alert("Please enter a grocery item and valid quantity.");
            return;
        }

        const item = new ShoppingItem(name, quantity);

        app.addShoppingItem(item);

        document.getElementById("shoppingItem").value = "";
        document.getElementById("shoppingQuantity").value = "1";

        showShoppingList();
    });


// DISPLAY SHOPPING LIST
function showShoppingList() {

    const list = document.getElementById("shoppingList");

    list.innerHTML = "";

    app.shoppingItems.forEach(item => {

        const li = document.createElement("li");

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;

        const text = document.createElement("span");
        text.textContent =
            `${item.name} (Quantity: ${item.quantity})`;

        if (item.completed) {
            text.style.textDecoration = "line-through";
        }

        checkbox.addEventListener("change", function () {

            item.completed = checkbox.checked;

            app.saveData();
            showShoppingList();
        });

        label.append(checkbox, text);

        const remove = document.createElement("button");
        remove.className = "delete-btn";
        remove.textContent = "Remove";

        remove.addEventListener("click", function () {

            app.removeItem("shoppingItems", item.id);

            showShoppingList();
        });

        li.append(label, remove);

        list.appendChild(li);
    });

    document.getElementById("shoppingEmpty").hidden =
        app.shoppingItems.length > 0;
}


// UPDATE BUDGET INFORMATION
function updateBudgetDisplay() {

    const spent = app.getTotalExpenses();
    const remaining = app.budget - spent;

    document.getElementById("budgetDisplay").textContent =
        peso(app.budget);

    document.getElementById("budgetSpent").textContent =
        peso(spent);

    document.getElementById("budgetRemaining").textContent =
        peso(remaining);

    let percentage = app.budget > 0
        ? Math.min((spent / app.budget) * 100, 100)
        : 0;

    document.getElementById("budgetProgress").style.width =
        percentage + "%";

    if (app.budget === 0) {
        document.getElementById("budgetMessage").textContent =
            "Set your budget to start tracking.";
    } else if (remaining >= 0) {
        document.getElementById("budgetMessage").textContent =
            `You have ${peso(remaining)} remaining.`;
    } else {
        document.getElementById("budgetMessage").textContent =
            `You are over budget by ${peso(Math.abs(remaining))}.`;
    }
}


// UPDATE HOME DASHBOARD
function updateDashboard() {

    document.getElementById("homeBudget").textContent =
        peso(app.budget);

    document.getElementById("homeSpent").textContent =
        peso(app.getTotalExpenses());

    document.getElementById("homeSavings").textContent =
        peso(app.getPotentialSavings());

    updateBudgetDisplay();
}


// INITIALIZE WEBSITE
function initializeApp() {

    document.getElementById("budgetAmount").value =
        app.budget || "";

    showSavedProducts();
    showExpenses();
    showShoppingList();
    updateDashboard();
}

initializeApp();
