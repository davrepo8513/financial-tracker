import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './BudgetModal.css';

const BudgetModal = ({ budget, categories, existingBudgets, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount.toString()
      });
    }
  }, [budget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    } else {
      // Check if category already has a budget (only for new budgets)
      if (!budget) {
        const existingBudget = existingBudgets.find(b => b.category === formData.category);
        if (existingBudget) {
          newErrors.category = 'Budget already exists for this category';
        }
      }
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const budgetData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    onSave(budgetData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Filter out categories that already have budgets (for new budget creation)
  const availableCategories = budget 
    ? categories 
    : categories.filter(category => 
        !existingBudgets.some(b => b.category === category)
      );

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{budget ? 'Edit Budget' : 'Add New Budget'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="budget-form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-control ${errors.category ? 'error' : ''}`}
              disabled={!!budget} // Disable category selection when editing
            >
              <option value="">Select a category</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Monthly Budget Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`form-control ${errors.amount ? 'error' : ''}`}
              placeholder="Enter budget amount"
              step="0.01"
              min="0"
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {budget ? 'Update' : 'Add'} Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;