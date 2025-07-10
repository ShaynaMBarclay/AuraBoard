import { useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;


function GifSearch({ onGifSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm) return;

    const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=12&rating=pg`;

    try {
      const response = await axios.get(url);
      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  }

  return (
    <div className="gif-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search GIFs..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="gif-results">
        {results.map(gif => (
          <img
            key={gif.id}
            src={gif.images.fixed_width.url}
            alt={gif.title}
            onClick={() => onGifSelect(gif.images.fixed_width.url)}
            className="gif-thumb"
          />
        ))}
      </div>
    </div>
  );
}

export default GifSearch;
