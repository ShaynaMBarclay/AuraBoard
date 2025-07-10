import { useState } from "react";
import { nanoid } from "nanoid";   
import GifModal from "../components/GifModal";

function Sidebar({ onImageUpload }) {
  const [showGifModal, setShowGifModal] = useState(false);


  function handleFileChange(e) {
    const files = Array.from(e.target.files);

    Promise.all(
      files.map(file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            id: nanoid(),
            src: reader.result,
            x: 0,
            y: 0,
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      )
    ).then(newImages => {
      onImageUpload(newImages); 
    });
  }

  function handleGifSelect(gifObject) {
    onImageUpload([gifObject]);
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

      <button
        onClick={() => setShowGifModal(true)}
        className="gif-search-btn"
      >
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
