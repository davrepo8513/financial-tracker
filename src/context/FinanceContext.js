import { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';

const FinanceContext = createContext();

// Initial state with default data
const initialState = {
  transactions: [
    {
      id: 1,
      type: 'income',
      amount: 5000,
      category: 'Salary',
      date: '2024-01-15',
      description: 'Monthly salary'
    },
    {
      id: 2,
      type: 'expense',
      amount: 1200,
      category: 'Groceries',
      date: '2024-01-16',
      description: 'Weekly grocery shopping'
    },
    {
      id: 3,
      type: 'expense',
      amount: 800,
      category: 'Rent',
      date: '2024-01-01',
      description: 'Monthly rent payment'
    },
    {
      id: 4,
      type: 'expense',
      amount: 300,
      category: 'Transportation',
      date: '2024-01-17',
      description: 'Gas and public transport'
    },
    {
      id: 5,
      type: 'income',
      amount: 1500,
      category: 'Freelance',
      date: '2024-01-10',
      description: 'Web development project'
    },
    {
      id: 6,
      type: 'expense',
      amount: 150,
      category: 'Entertainment',
      date: '2024-01-18',
      description: 'Movie and dinner'
    }
  ],
  budgets: [
    {
      id: 1,
      category: 'Groceries',
      amount: 2000,
      spent: 1200
    },
    {
      id: 2,
      category: 'Transportation',
      amount: 500,
      spent: 300
    },
    {
      id: 3,
      category: 'Entertainment',
      amount: 400,
      spent: 150
    },
    {
      id: 4,
      category: 'Rent',
      amount: 1000,
      spent: 800
    }
  ],
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    currency: '₹'
  },
  categories: [
    'Salary',
    'Freelance',
    'Investment',
    'Groceries',
    'Rent',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Education',
    'Shopping',
    'Utilities',
    'Other'
  ]
};

// Reducer function
const financeReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;

    case 'ADD_TRANSACTION':
      const newTransaction = {
        ...action.payload,
        id: Date.now()
      };
      
      // Check for budget overspend
      if (newTransaction.type === 'expense') {
        const budget = state.budgets.find(b => b.category === newTransaction.category);
        if (budget) {
          const newSpent = budget.spent + newTransaction.amount;
          if (newSpent > budget.amount) {
            toast.error(`Budget exceeded for ${newTransaction.category}! Spent: ${state.user.currency}${newSpent}, Budget: ${state.user.currency}${budget.amount}`);
          }
        }
      }
      
      return {
        ...state,
        transactions: [...state.transactions, newTransaction]
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };

    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, { ...action.payload, id: Date.now(), spent: 0 }]
      };

    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b =>
          b.id === action.payload.id ? action.payload : b
        )
      };

    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload)
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    default:
      return state;
  }
};

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('financeData');
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(state));
  }, [state]);

  // Calculate budget spent amounts based on transactions
  useEffect(() => {
    const updatedBudgets = state.budgets.map(budget => {
      const spent = state.transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });

    // Only update if there's a change to avoid infinite loop
    const hasChanged = updatedBudgets.some((budget, index) => 
      budget.spent !== state.budgets[index].spent
    );

    if (hasChanged) {
      dispatch({ type: 'LOAD_DATA', payload: { ...state, budgets: updatedBudgets } });
    }
  }, [state]);

  const value = {
    ...state,
    dispatch
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};