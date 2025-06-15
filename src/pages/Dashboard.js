import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import SummaryCards from '../components/Dashboard/SummaryCards';
import Charts from '../components/Dashboard/Charts';
import TodaysExpenses from '../components/Dashboard/TodaysExpenses';
import DateFilter from '../components/Dashboard/DateFilter';
import './Dashboard.css';

const Dashboard = () => {
  const { transactions, user } = useFinance();
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    if (!dateFilter.startDate && !dateFilter.endDate) {
      return transactions;
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

      if (start && end) {
        return transactionDate >= start && transactionDate <= end;
      } else if (start) {
        return transactionDate >= start;
      } else if (end) {
        return transactionDate <= end;
      }
      return true;
    });
  }, [transactions, dateFilter]);

  // Get today's expenses
  const todaysExpenses = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return transactions.filter(t => 
      t.type === 'expense' && t.date === today
    );
  }, [transactions]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
      </div>

      <SummaryCards 
        transactions={filteredTransactions} 
        currency={user.currency} 
      />

      <div className="dashboard-content">
        <div className="charts-section">
          <Charts 
            transactions={filteredTransactions} 
            currency={user.currency} 
          />
        </div>

        <div className="todays-expenses-section">
          <TodaysExpenses 
            expenses={todaysExpenses} 
            currency={user.currency} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;