import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import './Charts.css';

const Charts = ({ transactions, currency }) => {
  // Monthly spending trend data
  const monthlyData = useMemo(() => {
    const monthlySpending = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlySpending[monthKey]) {
          monthlySpending[monthKey] = 0;
        }
        monthlySpending[monthKey] += transaction.amount;
      });

    return Object.entries(monthlySpending)
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }),
        amount
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [transactions]);

  // Category-wise expense data
  const categoryData = useMemo(() => {
    const categorySpending = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (!categorySpending[transaction.category]) {
          categorySpending[transaction.category] = 0;
        }
        categorySpending[transaction.category] += transaction.amount;
      });

    return Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / Object.values(categorySpending).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', 
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {currency}{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.category}</p>
          <p className="tooltip-value">
            {currency}{payload[0].value.toLocaleString()} ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3>Monthly Spending Trend</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Category-wise Expense Split</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;