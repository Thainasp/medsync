import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import { MedicamentoProvider } from "./context/MedicamentoContext";

import { Calendar } from "./components/calendar";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Cadastro } from "./pages/cadastro";
import { RecuperacaoSenha } from "./pages/recuperacaoSenha";
import { Inicio } from "./pages/inicio";
import { Calendario } from "./pages/calendario";
import { Configurações } from "./pages/config";
import { Sobre } from "./pages/sobre";
import AdicionarMed from "./pages/addMed";
import { EditarMedicamento } from "./pages/editarMed";
import { Estoque } from "./pages/estoque";
import { EditarEstoque } from "./pages/editarEstoque";
import { AddMedEstoque } from "./pages/addMedEstoque";
import { AddReceita } from "./pages/addReceita";
import { EditarReceita } from "./pages/editarReceita";
import { Receitas } from "./pages/receitas";
import { ReceitaProvider } from "./context/ReceitaContext";

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
};

function App() {
  return (
    <>
      <Router>
        <ReceitaProvider>
          <MedicamentoProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/recuperacaoSenha" element={<RecuperacaoSenha />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/sobre" element={<Sobre />} />

              <Route path="/inicio" element={<Inicio />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/calendar" element={<Calendar />} />

              <Route path="/addMed" element={<AdicionarMed />} />
              <Route
                path="/editarMed"
                element={
                  <EditarMedicamento
                    isEdit={true}
                    medicamento={medicamentoMock}
                  />
                }
              />

              <Route path="/config" element={<Configurações />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/editarEstoque" element={<EditarEstoque />} />
              <Route path="/addMedEstoque" element={<AddMedEstoque />} />

              <Route path="/addReceita" element={<AddReceita />} />
              <Route path="/editarReceita" element={<EditarReceita />} />
              <Route path="/receitas" element={<Receitas />} />
            </Routes>
          </MedicamentoProvider>
        </ReceitaProvider>
      </Router>
    </>
  );
}

export default App;
