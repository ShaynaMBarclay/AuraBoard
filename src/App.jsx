import "./styles/App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";
import { useState } from 'react';


function App() {
  const [images, setImages] = useState([]);

  function handleImageUpload(newImages) {
    setImages(prev => [...prev, ...newImages]);
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar onImageUpload={handleImageUpload}/>
        <Board images={images} />
      </div>
    </div>
  );
}

export default App;
