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
import { Calendario } from "./pages/calendario";
import { Calendar } from "./components/calendar";

const medicamentoMock = {
  nomeMedicamento: "Dipirona",
  dosagem: 500,
  dataCompra: "2023-10-01",
  frequencia: "3",
  qtdUso: 1,
  tipoUso: "temporario",
  qtdDiasTratamento: 5,
  alertaEstoque: true,
  alertaMedicamento: true,
  alertaWhatsapp: true,
}

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
          <Route path="/editarMed" element={<AdicionarMed isEdit={true} medicamento={medicamentoMock} />} />
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
