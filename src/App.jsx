import "./styles/App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";
import Trashcan from "./components/Trashcan";
import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { nanoid } from "nanoid";  

function App() {
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem("moodboard_images");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("moodboard_images", JSON.stringify(images));
  }, [images]);

  function handleImageUpload(newImages) {
  const normalizedImages = newImages.map(img => {
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

  setImages(prev => [...prev, ...normalizedImages]);
}

     console.log("All image IDs:", images.map(img => img.id));
     console.log("Full images array:", images);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Sidebar onImageUpload={handleImageUpload} />
          <Board images={images} setImages={setImages} />
          <Trashcan setImages={setImages} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
