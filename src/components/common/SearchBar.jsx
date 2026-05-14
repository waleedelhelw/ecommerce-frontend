import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, placeholder = 'ابحث...', initialValue = '' }) => {
  const [term, setTerm] = useState(initialValue);

  useEffect(() => {
    setTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };

  const handleClear = () => {
    setTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          className="input-field pr-10"
        />
        {term && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
      <button type="submit" className="btn-primary">
        بحث
      </button>
    </form>
  );
};

export default SearchBar;