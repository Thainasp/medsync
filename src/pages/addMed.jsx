import { QuadroFundo } from "../components/quadroFundo";
import { TextoImportante } from "../components/TextoImportante";
import { TextoLongo } from "../components/TextoLongos";
import { MyButton } from "../components/myButton";
import { TelaBase } from "../components/telaBase";
import { FormContainer, Label , InputField, ErrorMessage , Legend} from "../components/forms";
import { useState } from "react";

export function AdicionarMed() {
    const [formData, setFormData] = useState({
      medicamento: "",
      qntComprada: "",
      dataCompra: "",
      frequencia: "",
      qntPorUso: "",
      diasTratamento: "",
      tipoUso: "Continuo",
      alertaEstoque: false,
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Medicamento salvo:", formData);
      alert("Medicamento salvo com sucesso!");
    };
    return (

      <TelaBase>
        <QuadroFundo>
          <TextoImportante>Adicionar Medicamento</TextoImportante>

          <FormContainer>
            <div className="form-group">
              <Label htmlFor="medicamento">Medicamento</Label>
              <InputField
                type="text"
                id="medicamento"
                name="medicamento"
                required
                placeholder="Insira o medicamento"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="dosagem">Dosagem:</Label>
              <InputField
                type="number"
                id="qqtcomprada"
                name="qqtcomprada"
                required
                placeholder="Insira Quantidade Comprada"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="dada-compra">Data da compra:</Label>
              <InputField
                type="date"
                id="data-compra"
                name="data-compra"
                required
                placeholder="Insira a data da compra"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="frequencia">Frequencia(Em horas):</Label>
              <InputField
                type="number"
                id="frequencia"
                name="frequencia"
                required
                placeholder="Insira a frequencia"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="quantidadeporUso">Quantidade por uso:</Label>
              <InputField
                type="number"
                id="quantidadeporUso"
                name="quantidadeporUso"
                required
                placeholder="Insira a quantidade por uso"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="diasTratamento">Dias de tratamento:</Label>
              <InputField
                type="number"
                id="diasTratamento"
                name="diasTratamento"
                required
                placeholder="Insira os dias de tratamento"
              />
            </div>
            <div className="form-group">
              <Legend>Tipo de uso</Legend>
              <Label htmlFor="Continuo">Continuo</Label>
              <input type="radio" id="Continuo" name="uso" value="Continu" />
              <Label htmlFor="Eventual">Temporario</Label>
              <input
                type="radio"
                id="Temporario"
                name="uso"
                value="Temporario"
              />
            </div>

            <div className="form-group">
              <input type="checkbox" id="AlertaEstoque" name="AlertaEstoque" />
              <label htmlFor="AlertaEstoque">
                Deseja receber alerta de quando seu medicamento estoer acabando?
              </label>
            </div>
            <MyButton type="submit">Salvar</MyButton>
          </FormContainer>
        </QuadroFundo>
      </TelaBase>
    );
}