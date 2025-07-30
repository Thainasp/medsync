import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Cadastro } from '../pages/cadastro'
import { Configurações } from '../pages/config'
import { EditarMedicamento } from '../pages/editarMed'
import { Home } from '../pages/home'
import { Login } from '../pages/login'
import { AdicionarMed } from '../pages/addMed'
import { Sobre } from '../pages/sobre'
import { Inicio } from '../pages/inicio'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/inicio" element={<Inicio/>}/>
          <Route path="/addMed" element={<AdicionarMed />} />
          <Route path="/editarMed" element={<EditarMedicamento />} />
          <Route path="/config" element={<Configurações/>}/>
          <Route path="/sobre" element={<Sobre/>}/>
        </Routes>
      </Router>

    </>
  )
}

export default App
