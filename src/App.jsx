import "./styles/App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";
import Trashcan from "./components/Trashcan";

import { useState, useEffect, useRef, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { nanoid } from "nanoid";

import {
  auth,
  signInAnonymously,
  onAuthStateChanged,
  db,
} from "./firebase";

import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import debounce from "lodash/debounce";

function App() {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);

  // Sign in anonymously or retrieve existing user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user images from Firestore
  useEffect(() => {
    if (!user) return;

    async function fetchImages() {
      const imagesCol = collection(db, "users", user.uid, "images");
      const imagesSnapshot = await getDocs(imagesCol);
      const imagesList = imagesSnapshot.docs.map((doc) => doc.data());
      setImages(imagesList);
    }

    fetchImages();
  }, [user]);

  // Save metadata to Firestore
  async function saveImageMetadata(image) {
    await setDoc(doc(db, "users", user.uid, "images", image.id), image);
  }

  // Delete from Firestore
  async function deleteImageMetadata(imageId) {
    await deleteDoc(doc(db, "users", user.uid, "images", imageId));
  }

  // Upload new image(s)
  async function handleImageUpload(newImages) {
    if (!user) {
      alert("Please wait for authentication to complete.");
      return;
    }

    const normalizedImages = newImages.map((img) => {
      if (typeof img === "string") {
        return {
          id: nanoid(),
          src: img,
          x: 0,
          y: 0,
        };
      }
      return img;
    });

    setImages((prev) => [...prev, ...normalizedImages]);

    for (const image of normalizedImages) {
      await saveImageMetadata(image);
    }
  }

  // Debounced update function
  const debouncedUpdateRef = useRef(
    debounce(async (userId, imageId, updates) => {
      await setDoc(
        doc(db, "users", userId, "images", imageId),
        { ...updates, id: imageId },
        { merge: true }
      );
    }, 300)
  );

  // Handle drag update
  const updateImage = useCallback(
    (imageId, updates) => {
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId ? { ...img, ...updates } : img
        )
      );

      if (user) {
        debouncedUpdateRef.current(user.uid, imageId, updates);
      }
    },
    [user]
  );

  // Delete an image
  async function handleDeleteImage(imageId) {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    await deleteImageMetadata(imageId);
  }

  if (!user) return <p>Loading authentication...</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Sidebar onImageUpload={handleImageUpload} user={user} />
          <Board
            images={images}
            setImages={setImages}
            updateImage={updateImage}
            user={user}
          />
          <Trashcan setImages={handleDeleteImage} user={user} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
