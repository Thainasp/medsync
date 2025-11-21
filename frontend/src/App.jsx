import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import { MedicamentoProvider } from "./context/MedicamentoContext";
import { ReceitaProvider } from "./context/ReceitaContext";
import { PrescricaoETratamentoProvider } from "./context/PrescricaoETratamentoContext";

import { PrivateRoute } from "./components/PrivateRoute";

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
          <PrescricaoETratamentoProvider>
            <MedicamentoProvider>
              <Routes>
                {/* === ROTAS PÚBLICAS (Qualquer um acessa) === */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/recuperacaoSenha" element={<RecuperacaoSenha />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/sobre" element={<Sobre />} />

                {/* === ROTAS PRIVADAS (Só acessa com Login) === */}
                {/* Note que embrulhamos o element com <PrivateRoute> */}

                <Route path="/inicio" element={
                  <PrivateRoute>
                    <Inicio />
                  </PrivateRoute>
                } />

                <Route path="/calendario" element={
                  <PrivateRoute>
                    <Calendario />
                  </PrivateRoute>
                } />
                
                <Route path="/calendar" element={
                  <PrivateRoute>
                    <Calendar />
                  </PrivateRoute>
                } />

                <Route path="/addMed" element={
                  <PrivateRoute>
                    <AdicionarMed />
                  </PrivateRoute>
                } />
                
                <Route path="/editarMed" element={
                  <PrivateRoute>
                    <EditarMedicamento
                      isEdit={true}
                      medicamento={medicamentoMock}
                    />
                  </PrivateRoute>
                } />

                <Route path="/config" element={
                  <PrivateRoute>
                    <Configurações />
                  </PrivateRoute>
                } />
                
                <Route path="/estoque" element={
                  <PrivateRoute>
                    <Estoque />
                  </PrivateRoute>
                } />
                
                <Route path="/editarEstoque" element={
                  <PrivateRoute>
                    <EditarEstoque />
                  </PrivateRoute>
                } />
                
                <Route path="/addMedEstoque" element={
                  <PrivateRoute>
                    <AddMedEstoque />
                  </PrivateRoute>
                } />

                <Route path="/addReceita" element={
                  <PrivateRoute>
                    <AddReceita />
                  </PrivateRoute>
                } />
                
                <Route path="/editarReceita" element={
                  <PrivateRoute>
                    <EditarReceita />
                  </PrivateRoute>
                } />
                
                <Route path="/receitas" element={
                  <PrivateRoute>
                    <Receitas />
                  </PrivateRoute>
                } />
                
              </Routes>
            </MedicamentoProvider>
          </PrescricaoETratamentoProvider>
        </ReceitaProvider>
      </Router>
    </>
  );
}

export default App;