import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Register } from './pages/register';
import { Login } from './pages/login';
import { AddProducts } from './pages/addproducts.tsx';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addproducts" element={<AddProducts />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
