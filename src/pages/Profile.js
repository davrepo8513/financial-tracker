import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { User, Edit, Save, X, DollarSign, TrendingUp, PiggyBank } from 'lucide-react';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, transactions, dispatch } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currency: user.currency
  });

  const currencies = [
    { symbol: '₹', name: 'Indian Rupee (INR)' },
    { symbol: '$', name: 'US Dollar (USD)' },
    { symbol: '€', name: 'Euro (EUR)' },
    { symbol: '£', name: 'British Pound (GBP)' },
    { symbol: '¥', name: 'Japanese Yen (JPY)' },
    { symbol: 'C$', name: 'Canadian Dollar (CAD)' },
    { symbol: 'A$', name: 'Australian Dollar (AUD)' }
  ];

  // Calculate lifetime statistics
  const lifetimeIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const lifetimeExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lifetimeSavings = lifetimeIncome - lifetimeExpenses;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required!');
      return;
    }

    dispatch({ type: 'UPDATE_USER', payload: formData });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      currency: user.currency
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <div className="avatar">
              <User size={48} />
            </div>
            
            <div className="user-details">
              {isEditing ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Default Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="form-control"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.symbol} value={currency.symbol}>
                          {currency.symbol} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSave}>
                      <Save size={16} />
                      Save Changes
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <h2>{user.name}</h2>
                  <p className="email">{user.email}</p>
                  <div className="currency-info">
                    <DollarSign size={16} />
                    <span>Default Currency: {user.currency}</span>
                  </div>
                  
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    <Edit size={16} />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h3>Lifetime Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card income">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <h4>Total Income</h4>
                <p className="stat-value">
                  {user.currency}{lifetimeIncome.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="stat-card expense">
              <div className="stat-icon">
                <TrendingUp size={24} style={{ transform: 'rotate(180deg)' }} />
              </div>
              <div className="stat-content">
                <h4>Total Expenses</h4>
                <p className="stat-value">
                  {user.currency}{lifetimeExpenses.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="stat-card savings">
              <div className="stat-icon">
                <PiggyBank size={24} />
              </div>
              <div className="stat-content">
                <h4>Total Savings</h4>
                <p className={`stat-value ${lifetimeSavings >= 0 ? 'positive' : 'negative'}`}>
                  {user.currency}{Math.abs(lifetimeSavings).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;