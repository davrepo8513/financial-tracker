import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Home, CreditCard, Target, User } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/budgets', icon: Target, label: 'Budgets' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Wallet className="brand-icon" />
          <h1>Finance Tracker</h1>
        </div>
        
        <nav className="header-nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;