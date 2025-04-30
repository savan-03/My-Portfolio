# Personal Expense Tracker

A fully-featured web application for tracking personal expenses, managing budgets, and visualizing spending patterns.

## Features

- **User Authentication**: Secure registration and login system with localStorage storage
- **Dashboard**: Overview of expenses, budgets, and recent transactions
- **Expense Tracking**: Add, edit, and delete expenses with categorization
- **Budget Planning**: Set and monitor category-based budgets
- **Reports and Analytics**: Visual charts showing spending patterns and trends
- **Responsive Design**: Works on desktop and mobile devices

## Modules

1. **User Authentication**: Registration and login with data persistence
2. **Dashboard**: Summary view of your financial activities
3. **Expense Management**: Track and categorize all expenses
4. **Budget Planning**: Set spending limits for different categories
5. **Reports/Analytics**: Visual representation of spending patterns

## Technologies Used

- HTML5
- CSS3 (with modern layout techniques)
- JavaScript (ES6+)
- Canvas API for charts
- LocalStorage for data persistence

## Setup and Usage

1. Clone or download this repository
2. Open `index.html` in your browser
3. Register a new account
4. Start tracking your expenses!

No backend server or database setup required. All data is stored in your browser's localStorage.

## Data Structure

The application uses the following data structure:

- **Users**: Stored as JSON in localStorage under 'users'
- **Current User**: Stored in localStorage under 'currentUser'
- **Expenses**: Stored per user under 'expenses_[email]'
- **Budgets**: Stored per user under 'budgets_[email]'

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Project Structure

```
personal-expense-tracker/
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── charts.js
│   └── chart-integration.js
├── images/
├── index.html
└── README.md
```

## Local Development

This is a client-side only application. To develop locally:

1. Make changes to the files
2. Refresh your browser to see changes

## License

MIT License 