import { useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

function GifModal({ onGifSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setOffset(0);

    try {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(
        searchTerm
      )}&limit=30&offset=0&rating=pg`;

      const response = await axios.get(url);
      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoadMore() {
    const newOffset = offset + 30;
    setIsLoading(true);

    try {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(
        searchTerm
      )}&limit=30&offset=${newOffset}&rating=pg`;

      const response = await axios.get(url);
      setResults(prev => [...prev, ...response.data.data]);
      setOffset(newOffset);
    } catch (error) {
      console.error('Error fetching more GIFs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGifClick(gifUrl) {
    onGifSelect({
      id: nanoid(),    // unique id for each gif added
      src: gifUrl,     // gif image url
      x: 0,            // initial x position on board
      y: 0,            // initial y position on board
    });
    onClose();
  }

  return (
    <div className="gif-modal-backdrop">
      <div className="gif-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search GIFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="gif-grid">
          {results.map(gif => (
            <img
              key={gif.id}
              src={gif.images.fixed_width.url}
              alt={gif.title}
              onClick={() => handleGifClick(gif.images.fixed_width.url)}
              className="gif-thumb"
            />
          ))}
        </div>

        {results.length > 0 && (
          <button
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
}

export default GifModal;
