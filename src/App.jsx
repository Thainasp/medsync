import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Cadastro } from "src/pages/cadastro";
import { Configurações } from "src/pages/config";
import { EditarMedicamento } from "src/pages/editarMed";
import { Home } from "src/pages/home";
import { Login } from "src/pages/login";
import AdicionarMed from "src/pages/addMed";
import { Sobre } from "src/pages/sobre";
import { Inicio } from "src/pages/inicio";
import { RecuperacaoSenha } from "src/pages/recuperacaoSenha";
import "./App.css";
import { Estoque } from "./pages/estoque";
import { EditarEstoque } from "./pages/editarEstoque";
import { AddMedEstoque } from "./pages/addMedEstoque";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperacaoSenha" element={<RecuperacaoSenha />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/inicio" element={<Inicio/>}/>
          <Route path="/calendario" element={<Calendario/>}/>
          <Route path="/calendar" element={<Calendar/>}/>
          <Route path="/addMed" element={<AdicionarMed />} />
          <Route path="/editarMed" element={<EditarMedicamento />} />
          <Route path="/config" element={<Configurações />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/estoque" element={<Estoque/>} />
          <Route path="/editarEstoque" element={<EditarEstoque/>} />
          <Route path="/addMedEstoque" element={<AddMedEstoque/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
