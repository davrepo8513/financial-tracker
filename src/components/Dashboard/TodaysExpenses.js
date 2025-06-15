import React from 'react';
import { Calendar } from 'lucide-react';
import './TodaysExpenses.css';

const TodaysExpenses = ({ expenses, currency }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalToday = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="todays-expenses">
      <div className="expenses-header">
        <div className="header-content">
          <Calendar className="calendar-icon" />
          <div>
            <h3>Today's Expenses</h3>
            <p className="date">{today}</p>
          </div>
        </div>
        <div className="total-today">
          <span className="total-label">Total:</span>
          <span className="total-amount">{currency}{totalToday.toLocaleString()}</span>
        </div>
      </div>

      <div className="expenses-list">
        {expenses.length === 0 ? (
          <div className="no-expenses">
            <p>No expenses recorded for today</p>
          </div>
        ) : (
          <div className="expenses-table">
            <div className="table-header">
              <span>Category</span>
              <span>Amount</span>
            </div>
            {expenses.map((expense) => (
              <div key={expense.id} className="expense-row">
                <div className="expense-info">
                  <span className="category">{expense.category}</span>
                  {expense.description && (
                    <span className="description">{expense.description}</span>
                  )}
                </div>
                <span className="amount">
                  {currency}{expense.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysExpenses;