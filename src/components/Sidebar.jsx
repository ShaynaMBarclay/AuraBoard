import { useState } from "react";
import { nanoid } from "nanoid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../firebase";
import GifModal from "../components/GifModal";

function Sidebar({ onImageUpload, user }) {
  const [showGifModal, setShowGifModal] = useState(false);

  async function handleFileChange(e) {
    if (!user) {
      alert("Please wait for authentication.");
      return;
    }

    const files = Array.from(e.target.files);

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const id = nanoid();
        const storageRef = ref(storage, `users/${user.uid}/images/${id}`);


        await uploadBytes(storageRef, file);

        const url = await getDownloadURL(storageRef);

        const docRef = doc(db, "users", user.uid, "images", id);
        await setDoc(docRef, {
          id,
          src: url,
          x: 0,
          y: 0,
          createdAt: serverTimestamp(),
        });

        return { id, src: url, x: 0, y: 0 };
      })
    );

    onImageUpload(uploadedImages);
  }

  async function handleGifSelect(gifObject) {
    if (!user) {
      alert("Please wait for authentication.");
      return;
    }

    const id = nanoid();

    const docRef = doc(db, "users", user.uid, "images", id);
    await setDoc(docRef, {
      id,
      src: gifObject.src,
      x: 0,
      y: 0,
      createdAt: serverTimestamp(),
    });

    onImageUpload([{ id, src: gifObject.src, x: 0, y: 0 }]);
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
