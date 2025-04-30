/**
 * Chart Integration for Expense Tracker
 * Connects the ExpenseCharts class with the main application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    const charts = new ExpenseCharts();
    
    // Get chart canvas elements
    const overviewChart = document.getElementById('overview-chart');
    const monthlyExpensesChart = document.getElementById('monthly-expenses-chart');
    const categoryTrendsChart = document.getElementById('category-trends-chart');
    
    // Connect with main application
    window.renderCharts = function(expenses, budgets, categories) {
        if (!expenses || !categories) return;
        
        renderOverviewChart(expenses, categories);
        renderMonthlyExpensesChart(expenses);
        renderCategoryTrendsChart(expenses, categories);
        renderBudgetProgress(expenses, budgets);
    };
    
    // Render pie chart for expense overview
    function renderOverviewChart(expenses, categories) {
        if (!overviewChart || !overviewChart.getContext) return;
        
        // Calculate expenses by category
        const expensesByCategory = {};
        categories.forEach(category => {
            expensesByCategory[category] = 0;
        });
        
        expenses.forEach(expense => {
            if (expensesByCategory[expense.category] !== undefined) {
                expensesByCategory[expense.category] += expense.amount;
            } else {
                expensesByCategory[expense.category] = expense.amount;
            }
        });
        
        // Prepare data for pie chart
        const data = Object.keys(expensesByCategory)
            .filter(category => expensesByCategory[category] > 0)
            .map((category, index) => ({
                label: category,
                value: expensesByCategory[category],
                color: charts.colors[index % charts.colors.length]
            }));
        
        // Draw pie chart
        charts.drawPieChart('overview-chart', data, {
            title: 'Expenses by Category',
            showLegend: true
        });
    }
    
    // Render bar chart for monthly expenses
    function renderMonthlyExpensesChart(expenses) {
        if (!monthlyExpensesChart || !monthlyExpensesChart.getContext) return;
        
        // Group expenses by month
        const expensesByMonth = {};
        
        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            if (!expensesByMonth[month]) {
                expensesByMonth[month] = {
                    total: 0,
                    label: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                };
            }
            
            expensesByMonth[month].total += expense.amount;
        });
        
        // Prepare data for bar chart
        const data = Object.keys(expensesByMonth)
            .sort() // Sort chronologically
            .map((month, index) => ({
                label: expensesByMonth[month].label,
                value: expensesByMonth[month].total,
                color: charts.colors[0] // Primary color
            }))
            .slice(-6); // Show last 6 months
        
        // Draw bar chart
        charts.drawBarChart('monthly-expenses-chart', data, {
            title: 'Monthly Expenses',
            padding: 40
        });
    }
    
    // Render line chart for category trends
    function renderCategoryTrendsChart(expenses, categories) {
        if (!categoryTrendsChart || !categoryTrendsChart.getContext) return;
        
        // Get last 6 months
        const today = new Date();
        const last6Months = [];
        
        for (let i = 0; i < 6; i++) {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
            last6Months.push({
                date: month,
                key: `${month.getFullYear()}-${month.getMonth() + 1}`
            });
        }
        
        last6Months.reverse(); // Order chronologically
        
        // Group expenses by category and month
        const categoryData = {};
        
        categories.forEach(category => {
            categoryData[category] = [];
            
            // Initialize with zero values for each month
            last6Months.forEach(month => {
                categoryData[category].push({
                    x: month.date.getTime(), // Convert to timestamp for comparison
                    y: 0
                });
            });
        });
        
        // Sum expenses by category and month
        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            const monthIndex = last6Months.findIndex(m => m.key === monthKey);
            
            if (monthIndex !== -1 && categoryData[expense.category]) {
                categoryData[expense.category][monthIndex].y += expense.amount;
            }
        });
        
        // Prepare series for line chart
        const series = Object.keys(categoryData)
            .filter(category => categoryData[category].some(point => point.y > 0)) // Only include categories with data
            .map((category, index) => ({
                name: category,
                data: categoryData[category],
                color: charts.colors[index % charts.colors.length]
            }));
        
        // Draw line chart
        charts.drawLineChart('category-trends-chart', series, {
            title: 'Expense Trends by Category',
            padding: 40,
            showLegend: true
        });
    }
    
    // Render budget progress bars
    function renderBudgetProgress(expenses, budgets) {
        if (!budgets || budgets.length === 0) return;
        
        // Calculate expenses by category
        const expensesByCategory = {};
        
        expenses.forEach(expense => {
            if (!expensesByCategory[expense.category]) {
                expensesByCategory[expense.category] = 0;
            }
            expensesByCategory[expense.category] += expense.amount;
        });
        
        // Update progress bars for each budget
        budgets.forEach(budget => {
            const spent = expensesByCategory[budget.category] || 0;
            const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
            
            const progressBarId = `budget-progress-${budget.id}`;
            const progressBarElement = document.getElementById(progressBarId);
            
            if (progressBarElement) {
                charts.drawProgressBar(progressBarId, percentage, {
                    showLabel: true
                });
            }
        });
    }
}); 