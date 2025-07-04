'use client';

import React from 'react';
// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface RoomSearchFilterProps {
  filters: {
    checkinDate: string;
    checkoutDate: string;
    priceMax: string;
  };
  searchValue: string;
  onFilterChange: (filters: any) => void;
  onSearchValueChange: (value: string) => void;
  onSearch: (params?: any) => void;
  onClearFilters: () => void;
  loading: boolean;
}

const RoomSearchFilter: React.FC<RoomSearchFilterProps> = ({
  filters,
  searchValue,
  onFilterChange,
  onSearchValueChange,
  onSearch,
  onClearFilters,
  loading
}) => {
  
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-amber-200">
      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: '#d4851c' }}>
          <SearchIcon className="w-4 h-4 inline mr-1" style={{ fontSize: '16px', color: '#d4851c' }} />
          ຄົ້ນຫາຫ້ອງພັກ
        </label>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchValueChange(e.target.value)}
          placeholder="ຄົ້ນຫາຕາມປະເພດຫ້ອງ ຫຼື ລາຄາ..."
          className="w-full border-2 rounded-lg px-4 py-3 text-sm transition-colors duration-200"
          style={{ 
            borderColor: '#d4851c',
            focusRingColor: '#d4851c',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#d4851c';
            e.target.style.boxShadow = '0 0 0 3px rgba(212, 133, 28, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d4851c';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Simple Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#d4851c' }}>
            <CalendarTodayIcon className="w-4 h-4 inline mr-1" style={{ fontSize: '16px', color: '#d4851c' }} />
            ວັນເຊັກອິນ
          </label>
          <input
            type="date"
            value={filters.checkinDate}
            onChange={(e) => handleFilterChange('checkinDate', e.target.value)}
            className="w-full border-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200"
            style={{ borderColor: '#d4851c' }}
            min={new Date().toISOString().split('T')[0]}
            onFocus={(e) => {
              e.target.style.borderColor = '#d4851c';
              e.target.style.boxShadow = '0 0 0 3px rgba(212, 133, 28, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d4851c';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#d4851c' }}>
            <CalendarTodayIcon className="w-4 h-4 inline mr-1" style={{ fontSize: '16px', color: '#d4851c' }} />
            ວັນເຊັກເອົາ
          </label>
          <input
            type="date"
            value={filters.checkoutDate}
            onChange={(e) => handleFilterChange('checkoutDate', e.target.value)}
            className="w-full border-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200"
            style={{ borderColor: '#d4851c' }}
            min={filters.checkinDate || new Date().toISOString().split('T')[0]}
            onFocus={(e) => {
              e.target.style.borderColor = '#d4851c';
              e.target.style.boxShadow = '0 0 0 3px rgba(212, 133, 28, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d4851c';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#d4851c' }}>
            ລາຄາສູງສຸດ (₭)
          </label>
          <input
            type="number"
            placeholder="ເຊັ່ນ: 500000"
            value={filters.priceMax}
            onChange={(e) => handleFilterChange('priceMax', e.target.value)}
            className="w-full border-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200"
            style={{ borderColor: '#d4851c' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#d4851c';
              e.target.style.boxShadow = '0 0 0 3px rgba(212, 133, 28, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d4851c';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105"
          style={{ 
            backgroundColor: '#d4851c',
            boxShadow: '0 4px 12px rgba(212, 133, 28, 0.3)'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#b8731a';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 133, 28, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#d4851c';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 133, 28, 0.3)';
            }
          }}
        >
          <SearchIcon className="w-4 h-4" style={{ fontSize: '16px' }} />
          {loading ? 'ກຳລັງຄົ້ນຫາ...' : 'ຄົ້ນຫາ'}
        </button>
        
        <button
          onClick={handleReset}
          disabled={loading}
          className="px-4 py-2 border-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200 transform hover:scale-105"
          style={{ 
            borderColor: '#d4851c',
            color: '#d4851c',
            backgroundColor: 'transparent'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#d4851c';
              e.currentTarget.style.color = 'white';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#d4851c';
            }
          }}
        >
          ລ້າງ
        </button>
      </div>
    </div>
  );
};

export default RoomSearchFilter;