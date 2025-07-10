import "./styles/App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <Board />
      </div>
    </div>
  );
}

export default App;
