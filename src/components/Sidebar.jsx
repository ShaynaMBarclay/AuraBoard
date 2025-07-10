import { useState } from 'react';
import GifSearch from "../components/GifSearch";
import GifModal from "../components/GifModal";

function Sidebar({ onImageUpload }) {
  const [showGifModal, setShowGifModal] = useState(false);

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    const imageURLs = files.map(file => URL.createObjectURL(file));
    onImageUpload(imageURLs);
  }

  function handleGifSelect(gifUrl) {
    onImageUpload([gifUrl]); 
  }

  return (
    <aside className="sidebar">
      <h2>Upload Images</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

       <button onClick={() => setShowGifModal(true)} className="gif-search-btn">
        Search GIFs
      </button>

      {showGifModal && (
        <GifModal
          onGifSelect={handleGifSelect}
          onClose={() => setShowGifModal(false)}
        />
      )}
    </aside>
  );
}

export default Sidebar;