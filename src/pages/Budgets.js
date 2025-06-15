import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import BudgetModal from '../components/Budgets/BudgetModal';
import BudgetCard from '../components/Budgets/BudgetCard';
import './Budgets.css';

const Budgets = () => {
  const { budgets, categories, user, dispatch } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      dispatch({ type: 'DELETE_BUDGET', payload: id });
      toast.success('Budget deleted successfully!');
    }
  };

  const handleSaveBudget = (budgetData) => {
    if (editingBudget) {
      dispatch({
        type: 'UPDATE_BUDGET',
        payload: { ...budgetData, id: editingBudget.id, spent: editingBudget.spent }
      });
      toast.success('Budget updated successfully!');
    } else {
      dispatch({ type: 'ADD_BUDGET', payload: budgetData });
      toast.success('Budget added successfully!');
    }
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const overspentBudgets = budgets.filter(budget => budget.spent > budget.amount);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <div className="budgets-page">
      <div className="budgets-header">
        <div className="header-content">
          <h1>Budgets</h1>
          <div className="budget-summary">
            <div className="summary-item">
              <span className="label">Total Budget:</span>
              <span className="value">{user.currency}{totalBudget.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="label">Total Spent:</span>
              <span className="value spent">{user.currency}{totalSpent.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="label">Remaining:</span>
              <span className={`value ${totalBudget - totalSpent >= 0 ? 'positive' : 'negative'}`}>
                {user.currency}{Math.abs(totalBudget - totalSpent).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <button className="add-budget-btn" onClick={handleAddBudget}>
          <Plus size={20} />
          Add Budget
        </button>
      </div>

      {overspentBudgets.length > 0 && (
        <div className="overspend-alert">
          <AlertTriangle size={20} />
          <div>
            <strong>Budget Alert!</strong>
            <p>
              {overspentBudgets.length} categor{overspentBudgets.length === 1 ? 'y has' : 'ies have'} exceeded their budget limits.
            </p>
          </div>
        </div>
      )}

      <div className="budgets-grid">
        {budgets.length === 0 ? (
          <div className="no-budgets">
            <h3>No budgets set yet</h3>
            <p>Create your first budget to start tracking your spending limits.</p>
            <button className="add-first-budget-btn" onClick={handleAddBudget}>
              <Plus size={20} />
              Create Your First Budget
            </button>
          </div>
        ) : (
          budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              currency={user.currency}
              onEdit={() => handleEditBudget(budget)}
              onDelete={() => handleDeleteBudget(budget.id)}
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <BudgetModal
          budget={editingBudget}
          categories={categories}
          existingBudgets={budgets}
          onSave={handleSaveBudget}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBudget(null);
          }}
        />
      )}
    </div>
  );
};

export default Budgets;