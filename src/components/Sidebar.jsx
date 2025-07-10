import { useState } from 'react';
import GifSearch from "../components/GifSearch";
import GifModal from "../components/GifModal";

function Sidebar({ onImageUpload }) {
  const [showGifModal, setShowGifModal] = useState(false);

  function handleFileChange(e) {
  const files = Array.from(e.target.files);

  Promise.all(
    files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file); 
      });
    })
  ).then(imageBase64Array => {
    onImageUpload(imageBase64Array);
  });
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