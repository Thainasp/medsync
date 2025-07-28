import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Cadastro } from '../pages/cadastro'
import { Configurações } from '../pages/config'
import { EditarMedicamento } from '../pages/editarMed'
import { Home } from '../pages/home'
import { Login } from '../pages/login'
import { AdicionarMed } from '../pages/addMed'
import { Sobre } from '../pages/sobre'
import './App.css'

function App() {

  return (
    <>
      <Router>

        <Routes>
          <Route path="/" element={<h1>Início Site</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/addMed" element={<AdicionarMed />} />
          <Route path="/ditarMed" element={<EditarMedicamento />} />
          <Route path="/config" element={<Configurações/>}/>
          <Route path="/sobre" element={<Sobre/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
