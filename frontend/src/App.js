import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'; 
import Inicio from './content/inicio.js';
import Ciudad from './content/ciudad.js';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/ciudad/:ciudad' element={<Ciudad />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
