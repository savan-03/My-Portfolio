// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // User Authentication
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const authButtons = document.getElementById('auth-buttons');
    
    // Navigation Elements
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Page Containers
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard');
    const expensesContainer = document.getElementById('expenses-container');
    const budgetContainer = document.getElementById('budget-container');
    const reportsContainer = document.getElementById('reports-container');
    const profileContainer = document.getElementById('profile-container');
    
    // Modal Elements
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const addExpenseBtnAlt = document.getElementById('add-expense-btn-2');
    const addBudgetBtn = document.getElementById('add-budget-btn');
    const expenseModal = document.getElementById('expense-modal');
    const budgetModal = document.getElementById('budget-modal');
    const closeExpenseModal = document.getElementById('close-expense-modal');
    const closeBudgetModal = document.getElementById('close-budget-modal');
    const expenseForm = document.getElementById('expense-form');
    const budgetForm = document.getElementById('budget-form');
    
    // User Data
    let currentUser = null;
    let expenses = [];
    let budgets = [];
    let categories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Healthcare', 'Others'];
    
    // Check if user is logged in
    function checkAuth() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            currentUser = JSON.parse(userData);
            loadUserData();
            showDashboard();
            updateUI();
        } else {
            showAuth();
        }
    }
    
    // Load user data from localStorage
    function loadUserData() {
        expenses = JSON.parse(localStorage.getItem(`expenses_${currentUser.email}`) || '[]');
        budgets = JSON.parse(localStorage.getItem(`budgets_${currentUser.email}`) || '[]');
    }
    
    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem(`expenses_${currentUser.email}`, JSON.stringify(expenses));
        localStorage.setItem(`budgets_${currentUser.email}`, JSON.stringify(budgets));
    }
    
    // Update UI based on authentication state
    function updateUI() {
        if (currentUser) {
            document.querySelectorAll('.user-name').forEach(el => el.textContent = currentUser.name);
            document.querySelectorAll('.user-email').forEach(el => el.textContent = currentUser.email);
            document.getElementById('profile-name').value = currentUser.name;
            document.getElementById('profile-email').value = currentUser.email;
            document.getElementById('profile-joined').value = new Date(currentUser.createdAt).toLocaleDateString();
            
            authButtons.style.display = 'none';
            logoutBtn.style.display = 'block';
            renderDashboard();
            renderExpenses();
            renderBudgets();
            renderReports();
        } else {
            authButtons.style.display = 'flex';
            logoutBtn.style.display = 'none';
        }
    }
    
    // Authentication Tab Switching
    if (loginTab) {
        loginTab.addEventListener('click', function() {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });
    }
    
    if (registerTab) {
        registerTab.addEventListener('click', function() {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
    
    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                loadUserData();
                showDashboard();
                updateUI();
            } else {
                alert('Invalid email or password');
            }
        });
    }
    
    // Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                alert('Email already exists');
                return;
            }
            
            // Add new user
            const newUser = { name, email, password, createdAt: new Date() };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto login
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Initialize user data
            initializeUserData();
            showDashboard();
            updateUI();
        });
    }
    
    // Initialize new user data
    function initializeUserData() {
        expenses = [];
        budgets = [
            { id: 1, category: 'Food', amount: 5000, createdAt: new Date() },
            { id: 2, category: 'Transport', amount: 3000, createdAt: new Date() },
            { id: 3, category: 'Housing', amount: 10000, createdAt: new Date() }
        ];
        saveUserData();
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            currentUser = null;
            showAuth();
            updateUI();
        });
    }
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // Hide all containers
            hideAllContainers();
            
            // Show selected container
            switch(target) {
                case 'dashboard':
                    showDashboard();
                    break;
                case 'expenses':
                    showExpenses();
                    break;
                case 'budget':
                    showBudget();
                    break;
                case 'reports':
                    showReports();
                    break;
                case 'profile':
                    showProfile();
                    break;
            }
        });
    });
    
    // Show/Hide Container Functions
    function hideAllContainers() {
        authContainer.style.display = 'none';
        dashboardContainer.style.display = 'none';
        expensesContainer.style.display = 'none';
        budgetContainer.style.display = 'none';
        reportsContainer.style.display = 'none';
        profileContainer.style.display = 'none';
    }
    
    function showAuth() {
        hideAllContainers();
        authContainer.style.display = 'block';
    }
    
    function showDashboard() {
        hideAllContainers();
        dashboardContainer.style.display = 'block';
        renderDashboard();
    }
    
    function showExpenses() {
        hideAllContainers();
        expensesContainer.style.display = 'block';
        renderExpenses();
    }
    
    function showBudget() {
        hideAllContainers();
        budgetContainer.style.display = 'block';
        renderBudgets();
    }
    
    function showReports() {
        hideAllContainers();
        reportsContainer.style.display = 'block';
        renderReports();
    }
    
    function showProfile() {
        hideAllContainers();
        profileContainer.style.display = 'block';
    }
    
    // Modal Functions
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', function() {
            expenseModal.classList.add('active');
            populateCategoryDropdown();
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('expense-date').value = today;
            
            // Clear edit id if exists
            expenseForm.removeAttribute('data-edit-id');
        });
    }
    
    if (addExpenseBtnAlt) {
        addExpenseBtnAlt.addEventListener('click', function() {
            expenseModal.classList.add('active');
            populateCategoryDropdown();
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('expense-date').value = today;
            
            // Clear edit id if exists
            expenseForm.removeAttribute('data-edit-id');
        });
    }
    
    if (closeExpenseModal) {
        closeExpenseModal.addEventListener('click', function() {
            expenseModal.classList.remove('active');
            expenseForm.reset();
        });
    }
    
    if (addBudgetBtn) {
        addBudgetBtn.addEventListener('click', function() {
            budgetModal.classList.add('active');
            populateBudgetCategoryDropdown();
            
            // Clear edit id if exists
            budgetForm.removeAttribute('data-edit-id');
        });
    }
    
    if (closeBudgetModal) {
        closeBudgetModal.addEventListener('click', function() {
            budgetModal.classList.remove('active');
            budgetForm.reset();
        });
    }
    
    // Populate Category Dropdowns
    function populateCategoryDropdown() {
        const categorySelect = document.getElementById('expense-category');
        categorySelect.innerHTML = '';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
    
    function populateBudgetCategoryDropdown() {
        const categorySelect = document.getElementById('budget-category');
        categorySelect.innerHTML = '';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
    
    // Add Expense Form Submission
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const description = document.getElementById('expense-description').value;
            const amount = parseFloat(document.getElementById('expense-amount').value);
            const category = document.getElementById('expense-category').value;
            const date = document.getElementById('expense-date').value;
            
            const editId = this.getAttribute('data-edit-id');
            
            if (editId) {
                // Update existing expense
                const expenseIndex = expenses.findIndex(e => e.id === parseInt(editId));
                
                if (expenseIndex !== -1) {
                    expenses[expenseIndex].description = description;
                    expenses[expenseIndex].amount = amount;
                    expenses[expenseIndex].category = category;
                    expenses[expenseIndex].date = date;
                    expenses[expenseIndex].updatedAt = new Date();
                }
                
                this.removeAttribute('data-edit-id');
            } else {
                // Add new expense
                const newExpense = {
                    id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
                    description,
                    amount,
                    category,
                    date,
                    createdAt: new Date()
                };
                
                expenses.push(newExpense);
            }
            
            saveUserData();
            renderExpenses();
            renderDashboard();
            renderReports();
            expenseModal.classList.remove('active');
            expenseForm.reset();
            
            // Render charts with updated data
            if (typeof window.renderCharts === 'function') {
                window.renderCharts(expenses, budgets, categories);
            }
        });
    }
    
    // Add Budget Form Submission
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const category = document.getElementById('budget-category').value;
            const amount = parseFloat(document.getElementById('budget-amount').value);
            
            const editId = this.getAttribute('data-edit-id');
            
            if (editId) {
                // Update existing budget
                const budgetIndex = budgets.findIndex(b => b.id === parseInt(editId));
                
                if (budgetIndex !== -1) {
                    budgets[budgetIndex].amount = amount;
                    budgets[budgetIndex].updatedAt = new Date();
                }
                
                this.removeAttribute('data-edit-id');
            } else {
                // Check if budget for category already exists
                const existingBudgetIndex = budgets.findIndex(b => b.category === category);
                
                if (existingBudgetIndex !== -1) {
                    budgets[existingBudgetIndex].amount = amount;
                    budgets[existingBudgetIndex].updatedAt = new Date();
                } else {
                    const newBudget = {
                        id: budgets.length > 0 ? Math.max(...budgets.map(b => b.id)) + 1 : 1,
                        category,
                        amount,
                        createdAt: new Date()
                    };
                    budgets.push(newBudget);
                }
            }
            
            saveUserData();
            renderBudgets();
            renderDashboard();
            budgetModal.classList.remove('active');
            budgetForm.reset();
            
            // Render charts with updated data
            if (typeof window.renderCharts === 'function') {
                window.renderCharts(expenses, budgets, categories);
            }
        });
    }
    
    // Delete Expense
    function deleteExpense(id) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveUserData();
        renderExpenses();
        renderDashboard();
        renderReports();
        
        // Render charts with updated data
        if (typeof window.renderCharts === 'function') {
            window.renderCharts(expenses, budgets, categories);
        }
    }
    
    // Delete Budget
    function deleteBudget(id) {
        budgets = budgets.filter(budget => budget.id !== id);
        saveUserData();
        renderBudgets();
        renderDashboard();
        
        // Render charts with updated data
        if (typeof window.renderCharts === 'function') {
            window.renderCharts(expenses, budgets, categories);
        }
    }
    
    // Calculate total expenses
    function calculateTotalExpenses() {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }
    
    // Calculate total budget
    function calculateTotalBudget() {
        return budgets.reduce((total, budget) => total + budget.amount, 0);
    }
    
    // Calculate expenses by category
    function calculateExpensesByCategory() {
        const result = {};
        categories.forEach(category => {
            result[category] = expenses
                .filter(expense => expense.category === category)
                .reduce((total, expense) => total + expense.amount, 0);
        });
        return result;
    }
    
    // Calculate budget vs spending by category
    function calculateBudgetVsSpending() {
        const expensesByCategory = calculateExpensesByCategory();
        const result = [];
        
        budgets.forEach(budget => {
            const spent = expensesByCategory[budget.category] || 0;
            const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
            
            result.push({
                category: budget.category,
                budget: budget.amount,
                spent: spent,
                remaining: budget.amount - spent,
                percentage: Math.min(percentage, 100)
            });
        });
        
        categories.forEach(category => {
            if (!budgets.some(budget => budget.category === category)) {
                const spent = expensesByCategory[category] || 0;
                if (spent > 0) {
                    result.push({
                        category: category,
                        budget: 0,
                        spent: spent,
                        remaining: -spent,
                        percentage: 100
                    });
                }
            }
        });
        
        return result;
    }
    
    // Render Dashboard
    function renderDashboard() {
        if (!dashboardContainer) return;
        
        const totalExpensesEl = document.getElementById('total-expenses');
        const totalBudgetEl = document.getElementById('total-budget');
        const budgetStatusEl = document.getElementById('budget-status');
        const recentExpensesList = document.getElementById('recent-expenses');
        
        const totalExpenses = calculateTotalExpenses();
        const totalBudget = calculateTotalBudget();
        const budgetVsSpending = calculateBudgetVsSpending();
        
        // Update summary cards
        if (totalExpensesEl) totalExpensesEl.textContent = `₹${totalExpenses.toFixed(2)}`;
        if (totalBudgetEl) totalBudgetEl.textContent = `₹${totalBudget.toFixed(2)}`;
        if (budgetStatusEl) {
            const remaining = totalBudget - totalExpenses;
            budgetStatusEl.textContent = `₹${Math.abs(remaining).toFixed(2)} ${remaining >= 0 ? 'Remaining' : 'Overspent'}`;
            budgetStatusEl.className = remaining >= 0 ? 'card-value text-success' : 'card-value text-danger';
        }
        
        // Render recent expenses
        if (recentExpensesList) {
            recentExpensesList.innerHTML = '';
            
            const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
            
            if (recentExpenses.length === 0) {
                recentExpensesList.innerHTML = '<tr><td colspan="4" class="text-center">No expenses found</td></tr>';
            } else {
                recentExpenses.forEach(expense => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${expense.description}</td>
                        <td>${expense.category}</td>
                        <td>₹${expense.amount.toFixed(2)}</td>
                        <td>${new Date(expense.date).toLocaleDateString()}</td>
                    `;
                    recentExpensesList.appendChild(row);
                });
            }
        }
        
        // Render charts with updated data
        if (typeof window.renderCharts === 'function') {
            window.renderCharts(expenses, budgets, categories);
        }
    }
    
    // Render Expenses
    function renderExpenses() {
        if (!expensesContainer) return;
        
        const expensesList = document.getElementById('expenses-list');
        
        if (expensesList) {
            expensesList.innerHTML = '';
            
            const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            if (sortedExpenses.length === 0) {
                expensesList.innerHTML = '<tr><td colspan="5" class="text-center">No expenses found</td></tr>';
            } else {
                sortedExpenses.forEach(expense => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${expense.description}</td>
                        <td>${expense.category}</td>
                        <td>₹${expense.amount.toFixed(2)}</td>
                        <td>${new Date(expense.date).toLocaleDateString()}</td>
                        <td class="table-actions">
                            <button class="action-btn edit-expense" data-id="${expense.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-expense" data-id="${expense.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    expensesList.appendChild(row);
                });
                
                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-expense').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        if (confirm('Are you sure you want to delete this expense?')) {
                            deleteExpense(id);
                        }
                    });
                });
                
                // Add event listeners to edit buttons
                document.querySelectorAll('.edit-expense').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        const expense = expenses.find(e => e.id === id);
                        
                        if (expense) {
                            // Populate form with expense data
                            document.getElementById('expense-description').value = expense.description;
                            document.getElementById('expense-amount').value = expense.amount;
                            document.getElementById('expense-category').value = expense.category;
                            document.getElementById('expense-date').value = expense.date;
                            
                            // Add expense ID to form for updating
                            expenseForm.setAttribute('data-edit-id', id);
                            
                            // Show modal
                            expenseModal.classList.add('active');
                            populateCategoryDropdown();
                        }
                    });
                });
            }
        }
    }
    
    // Render Budgets
    function renderBudgets() {
        if (!budgetContainer) return;
        
        const budgetsList = document.getElementById('budgets-list');
        const budgetVsSpending = calculateBudgetVsSpending();
        
        if (budgetsList) {
            budgetsList.innerHTML = '';
            
            if (budgetVsSpending.length === 0) {
                budgetsList.innerHTML = '<div class="text-center">No budgets found</div>';
            } else {
                budgetVsSpending.forEach(item => {
                    const budgetCard = document.createElement('div');
                    budgetCard.className = 'budget-card';
                    
                    let statusClass = '';
                    if (item.percentage >= 90) {
                        statusClass = 'danger';
                    } else if (item.percentage >= 70) {
                        statusClass = 'warning';
                    }
                    
                    budgetCard.innerHTML = `
                        <div class="budget-header">
                            <h3 class="card-title">${item.category}</h3>
                            <div class="table-actions">
                                <button class="action-btn edit-budget" data-category="${item.category}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                ${item.budget > 0 ? `
                                <button class="action-btn delete-budget" data-category="${item.category}">
                                    <i class="fas fa-trash"></i>
                                </button>
                                ` : ''}
                            </div>
                        </div>
                        <div class="budget-amount">Budget: ₹${item.budget.toFixed(2)}</div>
                        <div class="budget-spent">Spent: ₹${item.spent.toFixed(2)}</div>
                        <div class="budget-remaining">${item.remaining >= 0 ? 'Remaining' : 'Overspent'}: ₹${Math.abs(item.remaining).toFixed(2)}</div>
                        <div id="budget-progress-${budgets.find(b => b.category === item.category)?.id || 'new'}" class="budget-progress">
                            <div class="progress-bar-container">
                                <div class="progress-bar ${statusClass}" style="width: ${item.percentage}%"></div>
                            </div>
                            <div class="progress-text">
                                <span>${item.percentage.toFixed(0)}%</span>
                                <span>${item.remaining >= 0 ? 'used' : 'overspent'}</span>
                            </div>
                        </div>
                    `;
                    budgetsList.appendChild(budgetCard);
                });
                
                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-budget').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const category = this.getAttribute('data-category');
                        const budget = budgets.find(b => b.category === category);
                        
                        if (budget && confirm('Are you sure you want to delete this budget?')) {
                            deleteBudget(budget.id);
                        }
                    });
                });
                
                // Add event listeners to edit buttons
                document.querySelectorAll('.edit-budget').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const category = this.getAttribute('data-category');
                        const budget = budgets.find(b => b.category === category);
                        
                        if (budget) {
                            // Populate form with budget data
                            document.getElementById('budget-category').value = budget.category;
                            document.getElementById('budget-amount').value = budget.amount;
                            
                            // Add budget ID to form for updating
                            budgetForm.setAttribute('data-edit-id', budget.id);
                            
                            // Show modal
                            budgetModal.classList.add('active');
                            populateBudgetCategoryDropdown();
                        } else {
                            // New budget for this category
                            document.getElementById('budget-category').value = category;
                            document.getElementById('budget-amount').value = '';
                            
                            // Show modal
                            budgetModal.classList.add('active');
                            populateBudgetCategoryDropdown();
                        }
                    });
                });
            }
        }
    }
    
    // Render Reports
    function renderReports() {
        if (!reportsContainer) return;
        
        // Populate category dropdown
        const categorySelect = document.getElementById('report-category');
        if (categorySelect) {
            // Keep the first option (All Categories)
            categorySelect.innerHTML = '<option value="all">All Categories</option>';
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }
        
        // Report period change handler
        const reportPeriod = document.getElementById('report-period');
        const customDateRange = document.getElementById('custom-date-range');
        
        if (reportPeriod && customDateRange) {
            reportPeriod.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customDateRange.style.display = 'block';
                } else {
                    customDateRange.style.display = 'none';
                }
            });
        }
        
        // Generate report button handler
        const generateReportBtn = document.getElementById('generate-report-btn');
        
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', function() {
                // Filter expenses based on selected criteria
                const selectedPeriod = reportPeriod.value;
                const selectedCategory = categorySelect.value;
                let filteredExpenses = [...expenses];
                
                // Filter by date
                const today = new Date();
                let startDate, endDate;
                
                switch (selectedPeriod) {
                    case 'month':
                        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                        break;
                    case 'quarter':
                        const currentQuarter = Math.floor(today.getMonth() / 3);
                        startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
                        endDate = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 0);
                        break;
                    case 'year':
                        startDate = new Date(today.getFullYear(), 0, 1);
                        endDate = new Date(today.getFullYear(), 11, 31);
                        break;
                    case 'custom':
                        startDate = new Date(document.getElementById('report-start-date').value);
                        endDate = new Date(document.getElementById('report-end-date').value);
                        break;
                    default:
                        startDate = new Date(0); // Beginning of time
                        endDate = new Date(8640000000000000); // End of time
                }
                
                filteredExpenses = filteredExpenses.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate >= startDate && expenseDate <= endDate;
                });
                
                // Filter by category
                if (selectedCategory !== 'all') {
                    filteredExpenses = filteredExpenses.filter(expense => expense.category === selectedCategory);
                }
                
                // Render charts with filtered data
                if (typeof window.renderCharts === 'function') {
                    window.renderCharts(filteredExpenses, budgets, categories);
                }
            });
        }
        
        // Initial chart rendering
        if (typeof window.renderCharts === 'function') {
            window.renderCharts(expenses, budgets, categories);
        }
    }
    
    // Initialize App
    checkAuth();
}); 