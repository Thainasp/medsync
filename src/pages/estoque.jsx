import React, { useState } from 'react';

import { TelaBase } from "../components/telaBase";
import { TabelaEstoque } from '../components/tabelaEstoque';
import { MyButton } from '../components/myButton'; 
import { Footer } from '../components/footer'; 
import { TextoImportante } from "../components/TextoImportante";
import { QuadroFundo } from "../components/quadroFundo";

const MOCK_DATA = [
  { id: 1, nome: "Paracetamol 500mg", quantidade: 150 },
  { id: 2, nome: "Ibuprofeno 400mg", quantidade: 75 },
  { id: 3, nome: "Amoxicilina 250mg", quantidade: 30 },
];

export function Estoque() {
    const [medicamentos, setMedicamentos] = useState(MOCK_DATA);

    const handleDelete = (id) => {
        console.log(`Tentativa de exclusão do item com ID: ${id}`);
        setMedicamentos(medicamentos.filter(med => med.id !== id));
    };

    return ( 
        <TelaBase>
            <div>
                <TextoImportante>Estoque de medicamentos</TextoImportante>

                <div>
                    <MyButton>Adicionar Medicamento</MyButton>
                </div>
                <TabelaEstoque
                    data={medicamentos} 
                    onDelete={handleDelete} 
                />
            </div>
            <Footer></Footer>
        </TelaBase>
            
    );
}