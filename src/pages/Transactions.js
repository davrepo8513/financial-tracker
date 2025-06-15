import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-toastify';
import TransactionModal from '../components/Transactions/TransactionModal';
import './Transactions.css';

const Transactions = () => {
  const { transactions, categories, user, dispatch } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (sortConfig.key === 'type') {
      return sortConfig.direction === 'asc' 
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
    
    if (sortConfig.key === 'category') {
      return sortConfig.direction === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    
    return 0;
  });

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      toast.success('Transaction deleted successfully!');
    }
  };

  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: { ...transactionData, id: editingTransaction.id }
      });
      toast.success('Transaction updated successfully!');
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: transactionData });
      toast.success('Transaction added successfully!');
    }
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={16} className="sort-icon inactive" />;
    }
    return (
      <ArrowUpDown 
        size={16} 
        className={`sort-icon ${sortConfig.direction === 'asc' ? 'asc' : 'desc'}`} 
      />
    );
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <button className="add-transaction-btn" onClick={handleAddTransaction}>
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('type')} className="sortable">
                Type {getSortIcon('type')}
              </th>
              <th onClick={() => handleSort('amount')} className="sortable">
                Amount {getSortIcon('amount')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category {getSortIcon('category')}
              </th>
              <th onClick={() => handleSort('date')} className="sortable">
                Date {getSortIcon('date')}
              </th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-transactions">
                  No transactions found. Add your first transaction!
                </td>
              </tr>
            ) : (
              sortedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <span className={`type-badge ${transaction.type}`}>
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className={`amount ${transaction.type}`}>
                    {user.currency}{transaction.amount.toLocaleString()}
                  </td>
                  <td>{transaction.category}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description || '-'}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditTransaction(transaction)}
                        title="Edit transaction"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        title="Delete transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TransactionModal
          transaction={editingTransaction}
          categories={categories}
          onSave={handleSaveTransaction}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default Transactions;