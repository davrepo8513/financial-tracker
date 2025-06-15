import React from 'react';
import { TrendingUp, TrendingDown, Target, PiggyBank } from 'lucide-react';
import './SummaryCards.css';

const SummaryCards = ({ transactions, currency }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = totalIncome - totalExpenses;
  const savings = remainingBudget > 0 ? remainingBudget : 0;

  const cards = [
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: TrendingUp,
      color: 'green',
      bgColor: '#f0fff4'
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: TrendingDown,
      color: 'red',
      bgColor: '#fff5f5'
    },
    {
      title: 'Remaining Budget',
      amount: remainingBudget,
      icon: Target,
      color: remainingBudget >= 0 ? 'blue' : 'red',
      bgColor: remainingBudget >= 0 ? '#f0f9ff' : '#fff5f5'
    },
    {
      title: 'Savings',
      amount: savings,
      icon: PiggyBank,
      color: 'purple',
      bgColor: '#faf5ff'
    }
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="summary-card"
          style={{ backgroundColor: card.bgColor }}
        >
          <div className="card-header">
            <h3>{card.title}</h3>
            <card.icon 
              className="card-icon" 
              style={{ color: card.color === 'green' ? '#10b981' : 
                             card.color === 'red' ? '#ef4444' :
                             card.color === 'blue' ? '#3b82f6' : '#8b5cf6' }} 
            />
          </div>
          <div className="card-amount">
            <span 
              className={`amount ${card.amount < 0 ? 'negative' : ''}`}
              style={{ color: card.color === 'green' ? '#10b981' : 
                             card.color === 'red' ? '#ef4444' :
                             card.color === 'blue' ? '#3b82f6' : '#8b5cf6' }}
            >
              {currency}{Math.abs(card.amount).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;