import { useState, useEffect } from 'react';
import apiInstance from '../../utils/axios';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchData = async () => {
      const res = await apiInstance.get(`search?q=${searchTerm}`);
      const data = await res.json();
      setResults(data);
    };

    fetchData();
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        onChange={e => setSearchTerm(e.target.value)}
      />

      {results.map(item => (
        <p key={item.id}>{item.name}</p>
      ))}
    </div>
  );
}

export default Search;
