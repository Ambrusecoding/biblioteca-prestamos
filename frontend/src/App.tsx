import { ListaUsuarios } from "./components/organisms/ListaUsuarios/ListaUsuarios";
import { ListaLibros } from "./components/organisms/ListaLibros/ListaLibros";
import { ListaPrestamos } from "./components/organisms/ListaPrestamos/ListaPrestamos";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="app-left-panel">
        <ListaUsuarios />
        <ListaLibros />
      </div>
      <div className="app-right-panel">
        <ListaPrestamos />
      </div>
    </div>
  );
}

export default App;
