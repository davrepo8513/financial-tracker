import React from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import './BudgetCard.css';

const BudgetCard = ({ budget, currency, onEdit, onDelete }) => {
  const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
  const isOverspent = budget.spent > budget.amount;
  const remaining = budget.amount - budget.spent;

  const getProgressColor = () => {
    if (isOverspent) return '#ef4444';
    if (percentage > 80) return '#f59e0b';
    if (percentage > 60) return '#eab308';
    return '#10b981';
  };

  return (
    <div className={`budget-card ${isOverspent ? 'overspent' : ''}`}>
      <div className="budget-header">
        <div className="budget-info">
          <h3 className="budget-category">{budget.category}</h3>
          {isOverspent && (
            <div className="overspent-badge">
              <AlertTriangle size={16} />
              <span>Over Budget</span>
            </div>
          )}
        </div>
        <div className="budget-actions">
          <button className="action-btn edit" onClick={onEdit} title="Edit budget">
            <Edit size={16} />
          </button>
          <button className="action-btn delete" onClick={onDelete} title="Delete budget">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="budget-amounts">
        <div className="amount-row">
          <span className="label">Budget:</span>
          <span className="value">{currency}{budget.amount.toLocaleString()}</span>
        </div>
        <div className="amount-row">
          <span className="label">Spent:</span>
          <span className={`value ${isOverspent ? 'overspent' : ''}`}>
            {currency}{budget.spent.toLocaleString()}
          </span>
        </div>
        <div className="amount-row">
          <span className="label">Remaining:</span>
          <span className={`value ${remaining < 0 ? 'negative' : 'positive'}`}>
            {currency}{Math.abs(remaining).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-percentage">
            {Math.min(percentage, 100).toFixed(1)}%
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getProgressColor()
            }}
          />
          {percentage > 100 && (
            <div 
              className="progress-overflow"
              style={{ 
                width: `${Math.min(percentage - 100, 100)}%`,
                backgroundColor: '#ef4444'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;