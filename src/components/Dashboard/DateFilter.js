import React from 'react';
import { Calendar, X } from 'lucide-react';
import './DateFilter.css';

const DateFilter = ({ dateFilter, setDateFilter }) => {
  const handleStartDateChange = (e) => {
    setDateFilter(prev => ({
      ...prev,
      startDate: e.target.value
    }));
  };

  const handleEndDateChange = (e) => {
    setDateFilter(prev => ({
      ...prev,
      endDate: e.target.value
    }));
  };

  const clearFilters = () => {
    setDateFilter({
      startDate: '',
      endDate: ''
    });
  };

  const hasFilters = dateFilter.startDate || dateFilter.endDate;

  return (
    <div className="date-filter">
      <div className="filter-icon">
        <Calendar size={20} />
      </div>
      
      <div className="date-inputs">
        <div className="input-group">
          <label>From:</label>
          <input
            type="date"
            value={dateFilter.startDate}
            onChange={handleStartDateChange}
            className="date-input"
          />
        </div>
        
        <div className="input-group">
          <label>To:</label>
          <input
            type="date"
            value={dateFilter.endDate}
            onChange={handleEndDateChange}
            className="date-input"
          />
        </div>
      </div>

      {hasFilters && (
        <button 
          onClick={clearFilters}
          className="clear-filters"
          title="Clear filters"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default DateFilter;